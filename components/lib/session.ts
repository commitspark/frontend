import { deleteCookie, getCookie } from 'cookies-next'
import { COOKIE_SESSION_NAME } from '../../lib/provider/authenticator'
import { commitsparkConfig } from '../../commitspark.config'

export function getCookieSession(): string {
  const cookieValue = getCookie(COOKIE_SESSION_NAME)
  return `${cookieValue}`
}

export async function removeAuthentication(): Promise<void> {
  deleteCookie(COOKIE_SESSION_NAME)
  await commitsparkConfig.createAuthenticator().removeAuthentication()
}
