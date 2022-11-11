import { createClient as createUrqlClient } from 'urql'
import getProfiles from './queries/getProfiles'
import getPublications from './queries/getPublications'
import { refreshAuthToken } from '../utils/refreshAuthToken'
export const APIURL = 'https://api-mumbai.lens.dev' //"https://api.lens.dev"
export const STORAGE_KEY = "LH_STORAGE_KEY"
export const LENS_HUB_CONTRACT_ADDRESS = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82" //"0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
export const PERIPHERY_CONTRACT_ADDRESS = "0xD5037d72877808cdE7F669563e9389930AF404E8" //"0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f"

export const basicClient = new createUrqlClient({
  url: APIURL
})

export async function fetchProfile(id) {
  try {
    const urqlClient = await createClient()
    const returnedProfile = await urqlClient.query(getProfiles, { id }).toPromise();
    const profileData = returnedProfile.data.profiles.items[0]
    //profileData.color = generateRandomColor()
    const pubs = await urqlClient.query(getPublications, { id, limit: 50 }).toPromise()
    return {
      profile: profileData,
      publications: pubs.data.publications.items
    }
  } catch (err) {
    console.log('error fetching profile...', err)
  }
}

export async function createClient() {
  const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (storageData) {
    try {
      const { accessToken } = await refreshAuthToken()
      const urqlClient = new createUrqlClient({
        url: APIURL,
        fetchOptions: {
          headers: {
            'x-access-token': `Bearer ${accessToken}`
          },
        },
      })
      return urqlClient
    } catch (err) {
      return basicClient
    }
  } else {
    return basicClient
  }
}

export async function urqlQuery(query, variables) {
  const urqlClient = await createClient()
  const response = await urqlClient.query(query, variables).toPromise()
  return response
}

export async function urqlMutation(mutation, variables) {
  const urqlClient = await createClient()
  const response = await urqlClient.mutation(mutation, variables).toPromise()
  return response
}

