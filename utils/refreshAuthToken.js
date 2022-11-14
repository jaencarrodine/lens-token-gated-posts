import { basicClient, STORAGE_KEY, urqlMutation } from '../api'
import {refreshAPIToken} from '../api/mutations/refreshAPIToken'
import { parseJwt } from './parseJwt'
import { urqlUnauthenticatedMutation } from '../api'
export async function refreshAuthToken() {
  console.log('refreshing auth token...')
  const token = await JSON.parse(localStorage.getItem(STORAGE_KEY))
  console.log('token: ', token)
  console.log('token.accessToken: ', token.accessToken)
  //if the access token is undefined or expired, refresh it
  const currentTime = new Date().getTime() / 1000
  console.log(token.exp) 
  console.log(token.exp < currentTime)
  
      
    try{
      const authData = await urqlUnauthenticatedMutation(refreshAPIToken, { refreshToken: token.refreshToken })
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
  
}