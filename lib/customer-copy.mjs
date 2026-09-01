/**
 * Customer-facing copy source of truth.
 * Quiet luxury: short paragraphs. No slang. Intimate, not explicit.
 * Support templates interpolate {{order_number}}. They are reply copy,
 * not new payment or age-gate logic.
 */

export const BILLING_DESCRIPTOR = 'ROOM23 WELLNESS'
export const SUPPORT_EMAIL = 'support@room23.net'
export const REFUND_POLICY_URL = 'https://room23.net/shipping'

export function fillTemplate(text, vars = {}) {
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : `{{${key}}}`,
  )
}

export const STATEMENT_CHECKOUT = 'Your statement will read ROOM23 WELLNESS.'

export const PAYMENT_UI = {
  soft: 'Payment did not go through. Nothing was charged. You can try again, or use a different card.',
  hard: 'This card cannot be used for this order. Nothing was charged. Please try a different card.',
  processorDown:
    'Payments are briefly unavailable. Nothing was charged. Please try again in a few minutes.',
}

export const PACKAGING = {
  notice: 'Your order ships in plain, unlabeled packaging.',
  split: 'Your items will ship separately in plain, unlabeled packaging.',
  short: 'plain, unlabeled packaging',
  confirmation:
    'Your order ships in plain, unlabeled packaging. The exterior does not name what is inside.',
  statement:
    'Your statement will show ROOM23 WELLNESS. It will not include product names.',
}

export function buildOrderSubject(orderId) {
  return `Your Room 23 order ${orderId}`
}

export const SUPPORT_TEMPLATES = {
  declineRetry: {
    subject: 'We could not complete your Room 23 order',
    body: 'We were not able to complete payment for order {{order_number}}. Nothing was charged. This is usually a check from the card issuer. You can retry with the same card, or use a different one. Your order details are saved. If the charge goes through, your statement will show ROOM23 WELLNESS. Your order ships in plain, unlabeled packaging.',
  },
  statement: {
    subject: 'About your Room 23 statement',
    body: 'Your card statement will show ROOM23 WELLNESS. It will not include product names. Packaging is unlabeled and does not identify what is inside. If a charge looks unfamiliar, match ROOM23 WELLNESS to the amount on order {{order_number}}.',
  },
  shippingDelay: {
    subject: 'An update on your Room 23 order',
    body: 'Your order {{order_number}} is confirmed. It is taking longer than expected to ship. It will arrive in plain, unlabeled packaging. The exterior does not name what is inside. We will send tracking as soon as it is in transit. If you would like to cancel before it ships, reply to this message.',
  },
  returnHygiene: {
    subject: 'Returns for your Room 23 order',
    body: 'Unused items in original packaging can be returned within 14 days of delivery for a refund to the original payment method. For hygiene, we cannot accept returns of items that have been opened or used. We will not ask you to describe use. If something arrived damaged or incorrect, we will replace or refund it. Reply with your order number. You do not need to send a photo of an ID.',
  },
  cancelBeforeFulfillment: {
    subject: 'Cancel your Room 23 order',
    body: 'If order {{order_number}} has not shipped, we can cancel it and refund the original payment method in full. Reply to this message and we will confirm when the cancellation is complete. Your statement will show ROOM23 WELLNESS for the original charge and for the refund. If it has already shipped, we can help with a return instead. Unused items may be returned within 14 days of delivery.',
  },
}

export const FAQ_ITEMS = [
  {
    q: 'What will appear on my credit card statement?',
    a: 'Your statement will read ROOM23 WELLNESS. It will not include product names.',
  },
  {
    q: 'Is the packaging unlabeled?',
    a: 'Yes. Every order ships in plain, unlabeled packaging. The exterior does not name what is inside. The return address uses a generic name, not Room 23.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Orders are processed within 1–2 business days. Standard shipping (USPS Ground) arrives in 5–8 business days. Expedited shipping (USPS Priority) takes 2–4 business days. Express (UPS Next Day Air) is the next business day. FedEx 2Day is also available at checkout.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'We ship within the United States only, including all 50 states, US territories, and APO/FPO addresses.',
  },
  {
    q: 'Can I track my order?',
    a: 'When your order ships, we email a tracking number and a link to the carrier. Tracking can take up to 24 hours to activate.',
  },
  {
    q: 'Why is there an age check?',
    a: 'You must be 18 or older to enter. The age gate does not collect personal data. It sets a 30-day cookie so you are not asked again on every visit. It is not used to track you.',
  },
  {
    q: 'Can I return an item?',
    a: 'Unused items in original packaging can be returned within 14 days of delivery for a refund to the original payment method. For hygiene, we cannot accept returns of items that have been opened or used. We will not ask you to describe use. If an order has not shipped, we can cancel it and refund the original payment method in full.',
  },
  {
    q: 'What if something arrives damaged or incorrect?',
    a: 'We will replace or refund it. Email support@room23.net with your order number. A photo of the damaged product (the item, not a person or ID) can help. You do not need to send a photo of an ID.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Visa, Mastercard, American Express, and Discover. Payments are processed through a PCI-DSS Level 1 compliant gateway. Room 23 never stores full credit card numbers.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Transactions use 256-bit TLS encryption. Card numbers are tokenized and do not touch our servers. Your statement will read ROOM23 WELLNESS.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email support@room23.net. We respond within 24 hours on business days.',
  },
]
