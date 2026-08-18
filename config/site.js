/**
 * Centralized Site Configuration — single source of truth for all
 * business constants, legal text, and carrier information.
 *
 * Entity: California LLC — Filing B20260165153
 */

import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'

export const SITE_CONFIG = {
  // ── Brand Identity ──
  name: 'Room 23',
  legalName: 'Room 23 LLC',
  domain: 'room23.net',

  // ── Contact (public block — keep every page on these values) ──
  supportEmail: 'support@room23.net',
  supportPhone: '(425) 505-3528',
  hours: 'Mon–Fri 9:00 AM – 6:00 PM ET',

  mailingAddress: '5482 Wilshire Blvd #333, Los Angeles, CA 90036',
  address: '5482 Wilshire Blvd #333, Los Angeles, CA 90036',
  location: 'United States',
  governingLaw: 'State of California',

  bizStreet: '5482 Wilshire Blvd #333',
  bizCityState: 'Los Angeles, CA 90036',
  bizAddressFull: '5482 Wilshire Blvd #333, Los Angeles, CA 90036',

  // ── Billing & Payments ──
  billingDescriptor: process.env.NEXT_PUBLIC_BILLING_DESCRIPTOR || 'ROOM23 WELLNESS',
  paymentProcessor: 'CCBill',
  pciCheckoutWording:
    'Secure checkout processed by CCBill. Payment details are handled by our PCI-compliant payment processor.',
  checkoutEnabled: true,

  // ── Promotions ──
  discountCode: 'WELCOME10',
  discountPercentage: 10,

  // ── Shipping (must match /shipping) ──
  carriers: ['USPS', 'UPS', 'FedEx'],
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  flatShippingRate: FLAT_SHIPPING_RATE,

  // ── Legal ──
  lastUpdated: 'August 18, 2026',
  ageCookieDurationDays: 30,
}
