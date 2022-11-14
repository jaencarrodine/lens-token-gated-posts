import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../../styles/Layout.module.css';
import Head from 'next/head';
import { useAccount } from 'wagmi'
import { useUserInfo } from '../../store/useUserInfo'
import { createClient, STORAGE_KEY, urqlQuery, urqlMutation} from '../../api'
import {authenticate} from '../../api/mutations/authenticate'
import { getDefaultProfile} from '../../api/queries/getDefaultProfile';
import { getChallenge } from '../../api/queries/getChallenge';
import { useSignMessage } from 'wagmi'
import { useEffect } from 'react';
import {parseJwt} from '../../utils/parseJwt'
import {refreshAuthToken } from '../../utils/refreshAuthToken';

import { useRouter } from 'next/router'
import Dashboard from './Dashboard';

//TODO add error handling for get profile and get challenge
export default function Layout({ children }) {
    const profile = useUserInfo(state => state.profile)
    const userAddress = useUserInfo(state => state.userAddress)
    const setProfile = useUserInfo(state => state.setProfile)
    const setUserAddress = useUserInfo(state => state.setUserAddress)

    const {signMessageAsync} = useSignMessage()
    const account = useAccount({
        onConnect({ address }) {
            setUserAddress(address)
            if(userAddress !== address || profile === null) {
                signIn(address)
            }
        },
        onDisconnect(){
            setUserAddress(null)
            setProfile(null)
        }
    })

    

    const router = useRouter()
   

    useEffect(() => {
       
        listenForRouteChangeEvents()
    }, [])
    
    async function getUserProfile(address) {
        try {

            const response = await urqlQuery(getDefaultProfile, {address})

            setProfile(response.data.defaultProfile)
        } catch (err) {
            console.log('error fetching user profile...: ', err)
        }
    }

    async function listenForRouteChangeEvents() {
        router.events.on('routeChangeStart', () => {
            //refreshAuthToken()
        })
    }

    async function signIn(account) {
        try {
            const response = await urqlQuery(getChallenge, { address: account })
            const signature = await signMessageAsync({message:response.data.challenge.text})
            const authData = await urqlMutation(authenticate, {
            address: account, signature
            })
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
    const nonDashPages = ['/publication']
    const isDashboard = !nonDashPages.includes(router.pathname)

    

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
        
       
        <main className='min-h-screen h-full w-full flex flex-col relative bg-base-200'>
            {/* <div className='w-full p-3'>
                <ConnectButton />
                
            </div> */}
           {isDashboard &&
                <Dashboard >
                    {children}
                </Dashboard>
            }
        </main>

       
        </div>

    )

}