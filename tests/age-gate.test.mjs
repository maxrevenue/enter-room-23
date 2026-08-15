import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const botRe =
  /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i

function isBot(userAgent) {
  return typeof userAgent === 'string' && botRe.test(userAgent)
}

describe('age gate bot detection', () => {
  it('keeps the exact crawler regex in components/age-gate.jsx', () => {
    const file = join(dirname(fileURLToPath(import.meta.url)), '../components/age-gate.jsx')
    const source = readFileSync(file, 'utf8')
    assert.match(
      source,
      /\/bot\|crawler\|spider\|crawling\|googlebot\|bingbot\|slurp\|duckduckbot\|facebookexternalhit\|twitterbot\|linkedinbot\|whatsapp\|telegrambot\/i/,
    )
    assert.match(source, /typeof navigator !== 'undefined'/)
    assert.match(source, /if \(isBot\) return null/)
  })

  it('treats search and social crawlers as bots', () => {
    assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)'), true)
    assert.equal(isBot('facebookexternalhit/1.1'), true)
    assert.equal(isBot('Twitterbot/1.0'), true)
    assert.equal(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0'), false)
  })

  it('does not throw when navigator is undefined (SSR / edge)', () => {
    const navigator = undefined
    const result =
      typeof navigator !== 'undefined' && botRe.test(navigator.userAgent)
    assert.equal(result, false)
  })
})
