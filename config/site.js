/**
 * Centralized Site Configuration — single source of truth for all
 * business constants, legal text, and carrier information.
 *
 * Entity: California LLC — Filing B20260165153
 */

import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'
import { SITE_CONFIG as BASE_CONFIG } from '@/lib/constants'

export const SITE_CONFIG = {
  ...BASE_CONFIG,
  legalName: BASE_CONFIG.legalEntity,
  supportEmail: BASE_CONFIG.email,
  supportPhone: BASE_CONFIG.phone,
  hours: 'Mon–Fri 9:00 AM – 6:00 PM ET',
  principalAddress: '6010 Fulcher Ave, North Hollywood, CA 91606',
  mailingAddress: BASE_CONFIG.address.full,
  address: BASE_CONFIG.address.full,
  location: 'United States',
  governingLaw: 'State of California',
  bizStreet: BASE_CONFIG.address.street,
  bizCityState: `${BASE_CONFIG.address.city}, ${BASE_CONFIG.address.state} ${BASE_CONFIG.address.zip}`,
  bizAddressFull: BASE_CONFIG.address.full,
  // Default billing descriptor: ROOM23 WELLNESS (defined in lib/constants.ts)
  billingDescriptor: process.env.NEXT_PUBLIC_BILLING_DESCRIPTOR || BASE_CONFIG.billingDescriptor,
  checkoutEnabled: true,
  carriers: ['USPS', 'UPS', 'FedEx'],
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  flatShippingRate: FLAT_SHIPPING_RATE,
  lastUpdated: 'August 2026',
  ageCookieDurationDays: 30,
}
