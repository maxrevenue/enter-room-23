/**
 * Centralized Site Configuration — single source of truth for all
 * business constants, legal text, and carrier information.
 *
 * Address & phone are populated from Cloudflare env vars.
 * Falls back to honest pending notices for NMI underwriting transparency.
 */

export const SITE_CONFIG = {
  // ── Brand Identity ──
  name: 'Room 23',
  legalName: 'Room 23 LLC',
  domain: 'room23.net',

  // ── Contact ──
  supportEmail: process.env.ADMIN_EMAIL || 'support@room23.net',
  supportPhone: process.env.BIZ_PHONE || 'Available via Email Support',
  hours: 'Mon–Fri 9:00 AM – 6:00 PM ET',

  // ── Location ──
  location: 'United States',
  bizStreet: process.env.BIZ_ADDRESS_STREET || 'Address pending',
  bizCityState: process.env.BIZ_ADDRESS_CITY_STATE || 'Address pending',
  bizAddressFull:
    [process.env.BIZ_ADDRESS_STREET, process.env.BIZ_ADDRESS_CITY_STATE]
      .filter(Boolean)
      .join(', ') || 'Address pending',

  // ── Billing ──
  billingDescriptor: 'ROOM23',

  // ── Shipping ──
  carriers: ['USPS', 'UPS', 'FedEx'],
  freeShippingThreshold: 99.0,
  flatShippingRate: 8.0,

  // ── Legal ──
  /** Date the legal text was last materially revised (authored 2026-08-05). */
  legalLastUpdated: 'August 5, 2026',
}
