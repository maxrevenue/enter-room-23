/**
 * Consumes Workers Builds queue events and emails build status to NOTIFY_EMAIL.
 * Filtered to TARGET_WORKER (default: 123).
 *
 * Setup (requires CLOUDFLARE_API_TOKEN):
 *   npx wrangler queues create builds-123-notifications
 *   npx wrangler deploy --config workers/build-notifier/wrangler.jsonc
 *   npx wrangler secret put RESEND_API_KEY --config workers/build-notifier/wrangler.jsonc
 *   npx wrangler queues subscription create builds-123-notifications \
 *     --source workersBuilds.worker \
 *     --events build.started,build.succeeded,build.failed \
 *     --worker-name 123
 */

interface BuildEvent {
  type: string
  source?: { type?: string; workerName?: string }
  payload?: {
    buildUuid?: string
    buildOutcome?: string
    buildTriggerMetadata?: {
      branch?: string
      commitHash?: string
      commitMessage?: string
      author?: string
      repoName?: string
    }
  }
  metadata?: { eventTimestamp?: string }
}

interface Env {
  RESEND_API_KEY: string
  NOTIFY_EMAIL: string
  NOTIFY_FROM: string
  TARGET_WORKER: string
}

function eventLabel(type: string, outcome?: string): string {
  if (type.includes('failed') && outcome === 'cancelled') return 'Build cancelled'
  if (type.includes('failed')) return 'Build failed'
  if (type.includes('succeeded')) return 'Build succeeded'
  if (type.includes('started')) return 'Build started'
  return 'Build update'
}

function formatMessage(event: BuildEvent): { subject: string; text: string } {
  const worker = event.source?.workerName ?? 'unknown'
  const meta = event.payload?.buildTriggerMetadata ?? {}
  const label = eventLabel(event.type, event.payload?.buildOutcome)
  const subject = `[Room 23] ${label}: ${worker} (${meta.branch ?? 'unknown branch'})`
  const lines = [
    label,
    '',
    `Worker: ${worker}`,
    `Branch: ${meta.branch ?? '—'}`,
    `Commit: ${meta.commitHash ?? '—'}`,
    `Author: ${meta.author ?? '—'}`,
    `Message: ${meta.commitMessage ?? '—'}`,
    `Build ID: ${event.payload?.buildUuid ?? '—'}`,
    `Time: ${event.metadata?.eventTimestamp ?? '—'}`,
    '',
    'Repo: maxrevenue/enter-room-23',
  ]
  return { subject, text: lines.join('\n') }
}

async function sendEmail(env: Env, subject: string, text: string): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM,
      to: [env.NOTIFY_EMAIL],
      subject,
      text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${await response.text()}`)
  }
}

export default {
  async queue(batch: MessageBatch<BuildEvent>, env: Env): Promise<void> {
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      for (const message of batch.messages) message.ack()
      return
    }

    for (const message of batch.messages) {
      try {
        const event = message.body
        const workerName = event?.source?.workerName

        if (!event?.type || !workerName) {
          console.error('Invalid event', JSON.stringify(event))
          message.ack()
          continue
        }

        if (workerName !== env.TARGET_WORKER) {
          message.ack()
          continue
        }

        const { subject, text } = formatMessage(event)
        await sendEmail(env, subject, text)
        message.ack()
      } catch (error) {
        console.error('Failed to process build event', error)
        message.retry()
      }
    }
  },
} satisfies ExportedHandler<Env, BuildEvent>
