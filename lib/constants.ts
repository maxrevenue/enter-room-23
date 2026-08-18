export const SITE_CONFIG = {
  name: 'Room 23',
  legalEntity: 'Room 23 LLC',
  domain: 'room23.net',
  url: 'https://room23.net',
  address: {
    street: '5482 Wilshire Blvd #333',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90036',
    full: '5482 Wilshire Blvd #333, Los Angeles, CA 90036',
  },
  phone: '(425) 505-3528',
  email: 'support@room23.net',
  billingDescriptor: 'ROOM23 WELLNESS',
  paymentProcessor: 'CCBill',
  pciCheckoutWording:
    'Secure checkout processed by CCBill. Payment details are handled by our PCI-compliant payment processor.',
} as const
