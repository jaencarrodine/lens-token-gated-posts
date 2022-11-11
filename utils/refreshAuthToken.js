import { basicClient, STORAGE_KEY, urqlMutation } from '../api'
import refreshAPIToken from '../api/mutations/refreshAPIToken'
import { parseJwt } from './parseJwt'

export async function refreshAuthToken() {
  const token = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (!token) return
  try {
    const authData = await urqlMutation(refreshAPIToken, {
      refreshToken: token.refreshToken
    })
    console.log('authData: ', authData)

    if (!authData.data) return

    const { accessToken, refreshToken } = authData.data.refresh
    const exp = parseJwt(refreshToken).exp

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      accessToken, refreshToken, exp
    }))

    return {
      accessToken
    }
  } catch (err) {
    console.log('error:', err)
  }
}