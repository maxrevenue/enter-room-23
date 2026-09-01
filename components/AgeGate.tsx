import { cookies } from 'next/headers'
import AgeGateClient from './age-gate'

/**
 * Server wrapper so verified visitors never mount a blank splash.
 * Age verification stays a client overlay; middleware must not 307.
 */
export default async function AgeGate() {
  const jar = await cookies()
  const initiallyVerified =
    jar.get('room23_age_verified')?.value === 'true' ||
    jar.get('age_verified')?.value === 'true'

  return <AgeGateClient initiallyVerified={initiallyVerified} />
}
