import { commitsparkConfig } from '../../../../commitspark.config'

export async function GET(request: Request) {
  return commitsparkConfig.createAuthenticator().authenticate(request)
}
