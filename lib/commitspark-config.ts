import { Provider } from './provider/provider'
import { Authenticator } from './provider/authenticator'

export interface CommitsparkConfig {
  createProvider: () => Provider
  createAuthenticator: () => Authenticator
}
