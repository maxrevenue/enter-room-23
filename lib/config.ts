export const siteConfig = {
  isSoftLaunch: process.env.NEXT_PUBLIC_SOFT_LAUNCH === 'true',
  ageCookieDurationDays: 30,
  billingDescriptor: process.env.NEXT_PUBLIC_BILLING_DESCRIPTOR || 'ROOM23 WELLNESS',
  discountCode: 'WELCOME10',
  discountPercentage: 10,
  supportEmail: 'support@room23.net',
};
