import React from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import MY_NFT from '../../abi/mynft.json'
import { useUserInfo } from '../../store/useUserInfo';

export default function MintToken() {
    const userAddress = useUserInfo(state => state.userAddress)
  const { config } = usePrepareContractWrite({
    address: '0x9d4C4Fd92ea728bf324c4c21E43F764699FdeAd6',
    abi: MY_NFT,
    functionName: 'mintNFT',
    args:[
        userAddress, ''
    ]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  
  return (
    <div>
      <button disabled={!write} onClick={() => write?.(userAddress, '')}>
        Mint
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  )
}