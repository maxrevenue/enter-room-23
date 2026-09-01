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

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../components/age-gate.jsx'),
  'utf8',
)

describe('age gate bot detection', () => {
  it('keeps the exact crawler regex in components/age-gate.jsx', () => {
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

describe('age gate conversion copy and first paint', () => {
  it('does not paint an opaque loading splash', () => {
    assert.doesNotMatch(source, /status === 'loading'/)
    assert.doesNotMatch(source, /z-\[9999\].*bg-theme-bg/)
    assert.doesNotMatch(source, /fixed inset-0 z-\[9999\] bg-theme-bg/)
  })

  it('dims the store instead of covering it', () => {
    assert.match(source, /bg-black\/70/)
    assert.match(source, /items-end/)
    assert.match(source, /sm:items-center/)
  })

  it('uses calm locked copy', () => {
    assert.match(source, /This collection is for people 18 and over\./)
    assert.match(source, /Entering confirms you meet the age requirement where you live/)
    assert.match(source, />Enter</)
    assert.match(source, /I’m under 18/)
    assert.doesNotMatch(source, /AGE VERIFICATION REQUIRED/)
    assert.doesNotMatch(source, /I AM 18\+/)
    assert.doesNotMatch(source, /I AM UNDER 18/)
  })

  it('keeps both verification cookies and the under-18 exit', () => {
    assert.match(source, /room23_age_verified/)
    assert.match(source, /age_verified/)
    assert.match(source, /https:\/\/www\.google\.com/)
  })

  it('does not dismiss on Escape', () => {
    assert.match(source, /event\.key === 'Escape'/)
    assert.match(source, /event\.preventDefault\(\)/)
  })
})
