/**
 * Business contact information.
 * Populated from environment variables in production; falls back to
 * honest pending notices for NMI underwriting review transparency.
 */

export const BUSINESS_STREET = process.env.BIZ_ADDRESS_STREET || 'Address pending'
export const BUSINESS_CITY_STATE = process.env.BIZ_ADDRESS_CITY_STATE || 'Address pending'
export const BUSINESS_PHONE = process.env.BIZ_PHONE || 'Phone number pending'
export const SUPPORT_EMAIL = process.env.ADMIN_EMAIL || 'support@room23.net'
export const BUSINESS_ADDRESS_FULL = `${BUSINESS_STREET}, ${BUSINESS_CITY_STATE}`

/** Date the legal text was last materially revised (authored 2026-08-05). */
export const LEGAL_LAST_UPDATED = 'August 5, 2026'
