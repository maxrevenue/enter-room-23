#!/usr/bin/env node
/**
 * After `opennextjs-cloudflare build`, install the custom Worker entry from
 * `src/index.js` without changing wrangler.jsonc (main stays `.open-next/worker.js`).
 *
 * Layout after wrap:
 *   .open-next/opennext-worker.js  — original OpenNext entry
 *   .open-next/worker.js          — custom entry (from src/index.js)
 */
import { copyFileSync, existsSync, readFileSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const openNextDir = join(root, '.open-next')
const generatedWorker = join(openNextDir, 'worker.js')
const renamedWorker = join(openNextDir, 'opennext-worker.js')
const customEntry = join(root, 'src', 'index.js')

if (!existsSync(generatedWorker)) {
  console.error(
    'wrap-opennext-worker: missing .open-next/worker.js — run opennextjs-cloudflare build first',
  )
  process.exit(1)
}

if (!existsSync(customEntry)) {
  console.error('wrap-opennext-worker: missing src/index.js')
  process.exit(1)
}

const current = readFileSync(generatedWorker, 'utf8')
const alreadyWrapped = current.includes('opennext-worker.js')

if (!alreadyWrapped) {
  renameSync(generatedWorker, renamedWorker)
}

copyFileSync(customEntry, generatedWorker)
console.log(
  'wrap-opennext-worker: installed src/index.js as .open-next/worker.js (OpenNext → opennext-worker.js)',
)
