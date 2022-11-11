import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../../styles/Layout.module.css';
import Head from 'next/head';
import { useAccount } from 'wagmi'
import { useUserInfo } from '../../store/useUserInfo'
import { createClient, STORAGE_KEY, authenticate as authenticateMutation, getChallenge, getDefaultProfile, getProfile } from '../../api'
import { useSignMessage } from 'wagmi'
import { useEffect } from 'react';
import { parseJwt, refreshAuthToken } from '../../utils/utils'
import { useRouter } from 'next/router'
//TODO sign out on wallet disconnect
export default function Layout({ children }) {
    const profile = useUserInfo(state => state.profile)
    const userAddress = useUserInfo(state => state.userAddress)
    const setProfile = useUserInfo(state => state.setProfile)
    const setUserAddress = useUserInfo(state => state.setUserAddress)

    const {signMessageAsync} = useSignMessage()
    const account = useAccount({
        onConnect({ address }) {
            setUserAddress(address)
            if(userAddress !== address) {
                signIn(address)
            }
        },
    })

    const router = useRouter()
   

    useEffect(() => {
        refreshAuthToken()
        listenForRouteChangeEvents()
    }, [])
    
    async function getUserProfile(address) {
        try {
            const urqlClient = await createClient()
            const response = await urqlClient.query(getDefaultProfile, {
            address
            }).toPromise()
            console.log('response', response.data)
            // const response = await urqlClient.query(getProfile).toPromise()
            // console.log('response: ', response)
            setProfile(response.data.defaultProfile)
        } catch (err) {
            console.log('error fetching user profile...: ', err)
        }
    }

    async function listenForRouteChangeEvents() {
        router.events.on('routeChangeStart', () => {
            refreshAuthToken()
        })
    }

    async function signIn(account) {
        try {
            const urqlClient = await createClient()
            const response = await urqlClient.query(getChallenge, {
            address: account
            }).toPromise()
            
           console.log('message', response.data.challenge.text)
            const signature = await signMessageAsync({message:response.data.challenge.text})
            const authData = await urqlClient.mutation(authenticateMutation, {
            address: account, signature
            }).toPromise()
            const { accessToken, refreshToken } = authData.data.authenticate
            const accessTokenData = parseJwt(accessToken)
            getUserProfile(account)
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
            accessToken, refreshToken, exp: accessTokenData.exp
            }))
        } catch (err) {
            console.log('error: ', err)
        }
    }


    

    return(

        <div className={styles.container}>
        <Head>
            <title>Lens Key </title>
            <meta
            name="description"
            content=""
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
       
        <main className='min-h-screen h-full w-full flex flex-col relative'>
            <div className='w-full p-3'>
                <ConnectButton />
                
            </div>

            {children}
        </main>

        <footer className={styles.footer}>
            <a href="https://www.open.jaen.app" target="_blank" rel="noopener noreferrer">
                app by Jaen
            </a>
        </footer>
        </div>

    )

}