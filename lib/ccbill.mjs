import crypto from 'crypto'

/**
 * One-time (non-recurring) CCBill FlexForms URL for tangible goods.
 * Digest: initialPrice + initialPeriod + currencyCode + salt
 * https://ccbill.com/doc/formdigest-value
 */
export function buildCCBillFlexFormUrl({
  total,
  orderId,
  email,
  env = process.env,
  domain,
}) {
  const account = env.CCBILL_ACCOUNT_NUMBER
  const subAccount = env.CCBILL_SUB_ACCOUNT
  const flexFormId = env.CCBILL_FLEXFORM_ID
  const salt = env.CCBILL_SALT
  const currencyCode = env.CCBILL_CURRENCY_CODE || '840'

  if (!account || !subAccount || !flexFormId || !salt) {
    return null
  }

  const initialPrice = Number(total).toFixed(2)
  const initialPeriod = '2'
  const digestString = `${initialPrice}${initialPeriod}${currencyCode}${salt}`
  const formDigest = crypto.createHash('md5').update(digestString).digest('hex')

  const params = new URLSearchParams({
    clientAccnum: account,
    clientSubacc: subAccount,
    initialPrice,
    initialPeriod,
    currencyCode,
    formDigest,
    orderId,
  })

  if (email) params.set('email', email)
  if (domain) {
    params.set('redirectUrl', `https://${domain}/order-confirmed`)
  }

  return `https://api.ccbill.com/wap-frontflex/flexforms/${flexFormId}?${params.toString()}`
}

export function isCheckoutMockEnabled(env = process.env) {
  if (env.CHECKOUT_MOCK === 'true') return true
  if (env.CHECKOUT_MOCK === 'false') return false
  return env.NODE_ENV !== 'production'
}
