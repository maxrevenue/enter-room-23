/**
 * Centralized Site Configuration — single source of truth for all
 * business constants, legal text, and carrier information.
 *
 * Entity: California LLC — Filing B20260165153
 */

export const SITE_CONFIG = {
  // ── Brand Identity ──
  name: 'Room 23',
  legalName: 'Room 23 LLC',
  domain: 'room23.net',

  // ── Contact ──
  supportEmail: 'support@room23.net',
  supportPhone: '(425) 505-3528',
  hours: 'Mon–Fri 9:00 AM – 6:00 PM ET',

  // ── Location (CA SOS Filing B20260165153) ──
  principalAddress: '6010 Fulcher Ave, North Hollywood, CA 91606',
  mailingAddress: '5482 Wilshire Blvd #333, Los Angeles, CA 90036',
  address: '5482 Wilshire Blvd #333, Los Angeles, CA 90036', // Primary public
  location: 'United States',

  // Backward-compatible aliases for existing components
  bizStreet: '5482 Wilshire Blvd #333',
  bizCityState: 'Los Angeles, CA 90036',
  bizAddressFull: '5482 Wilshire Blvd #333, Los Angeles, CA 90036',

  // ── Billing ──
  billingDescriptor: process.env.NEXT_PUBLIC_BILLING_DESCRIPTOR || 'ROOM23 WELLNESS',
  checkoutEnabled: process.env.NEXT_PUBLIC_SOFT_LAUNCH !== 'true',
  softLaunch: process.env.NEXT_PUBLIC_SOFT_LAUNCH === 'true',

  // ── Shipping ──
  carriers: ['USPS', 'UPS', 'FedEx'],
  freeShippingThreshold: 99.0,
  /** Standard USPS Ground rate — must match /shipping table */
  flatShippingRate: 5.99,

  // ── Legal ──
  lastUpdated: 'August 1, 2026',
}
