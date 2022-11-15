import React from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import MY_NFT from '../../abi/mynft.json'

import { useAccount } from 'wagmi'
import Spinner from '../Utils/Spinner';

export default function MintToken() {
   
  const {address} = useAccount()
  const { config } = usePrepareContractWrite({
    address: '0x9d4C4Fd92ea728bf324c4c21E43F764699FdeAd6',
    abi: MY_NFT,
    functionName: 'mintNFT',
    args:[
        address, ''
    ]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  
  return (
 
    <button disabled={!write} onClick={() => write?.()} className='inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mt-5 sm:mt-6'>
     {
        isLoading ? <Spinner size ='5' color ='secondary' background='gray-200'/> : isSuccess ? 'Access Token Minted!' :'Mint Access Token'
     } 

    </button>
      
  )
}