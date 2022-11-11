import { basicClient, STORAGE_KEY, urqlMutation } from '../api'
import {refreshAPIToken} from '../api/mutations/refreshAPIToken'
import { parseJwt } from './parseJwt'
import { createClient } from '../api'
export async function refreshAuthToken() {
  const token = JSON.parse(localStorage.getItem(STORAGE_KEY))
  console.log('token: ', token)
  if (token.accessToken === undefined){
    
    
  
    try {
      const client = await createClient()
      const authData = await client.mutation(refreshAPIToken, { refreshToken: token.refreshToken }).toPromise()
      // const authData = await (refreshAPIToken, {
      //   refreshToken: token.refreshToken
      // })
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
  } else {
    return {
      accessToken: token.accessToken
    }
  }
}