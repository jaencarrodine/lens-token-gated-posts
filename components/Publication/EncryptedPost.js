import React from "react"
import {useState, useEffect} from "react"
import { useUserInfo } from "../../store/useUserInfo"
import { useSignMessage } from "wagmi"
import lit from "../../lib/lit"
import ReactMarkdown from 'react-markdown'
import Modal from "../Utils/Modal"
import { placeholderMarkdown } from "../../lib/placeholderMarkdown"
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import AlchemyAPI from "../../lib/alchemy"
import MintToken from "../MintToken"
//todo handle loading
export default function EncryptedPost({publication, encryptedSymmetricKey, accessControlConditions}){
    const { openConnectModal } = useConnectModal();
    const {isConnected} = useAccount()
    const [decryptedContent, setDecryptedContent] = useState(placeholderMarkdown)
    const [contentDecrypted, setContentDecrypted] = useState(false)
    const [contractName, setContractName] = useState('')
    const [modalOpen, setModalOpen] = useState(true)
    const message = 'Sign this message to decrypt the post'
    const {signMessageAsync, isLoading} = useSignMessage({
        message: message
    })

    const userAddress = useUserInfo(state => state.userAddress)
    const signData = {
        userAddress: userAddress,
        message: message,
        signMessageAsync: signMessageAsync
    }
    async function decryptContent(){
        console.log('decrypting content...')
        console.log(publication)
        console.log('accessControlConditions: ', accessControlConditions)
        let encryptedString = publication.metadata.content
        const encryptedBlob = await (await fetch(encryptedString)).blob()
        let decryption =  await lit.decryptText(encryptedBlob, encryptedSymmetricKey, accessControlConditions, signData)
        setDecryptedContent(decryption)
        setModalOpen(false)
        //TODO handle failure
    }

    useEffect(() => {
        if(accessControlConditions[0] !== undefined){
            loadNftData(accessControlConditions[0].contractAddress)
        }
       
    }, [])

    async function loadNftData(contractAddress){
        //TODO chain should not be hardcoded here
        const alc = new AlchemyAPI('MATIC_MUMBAI')
        let collectionInfo = await alc.getNftCollectionData(contractAddress)
        console.log(collectionInfo)
        setContractName(collectionInfo.name)
        return ''
        
    }
        
    
  
    return (
        <div className="bg-white min-h-screen " data-theme = 'light'>
            <div className="absolute z-20 top-0 right-0 p-4">

                <ConnectButton showBalance={false} />   
            </div>
            <Modal open = {modalOpen} setOpen={()=>{}} >
                <div className="flex flex-col items-center justify-center">
               
               
                {!isConnected ?
                    <>
                        <h3 className="w-full text-xl text-center font-semi-bold px-7">This Lens post is encrypted. Connect your wallet to get started.</h3>
                        <button
                            type="button"
                            className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mt-5 sm:mt-6"
                            onClick = {openConnectModal}
                        >
                            Connect Wallet 
                        </button>
                    </>
                
                    :
                    <>

                        <h3 className="w-full text-xl  text-center font-semi-bold px-7">You must own "{contractName}" NFT to decrypt this lens post.</h3>
                        <div className="flex flex-row space-x-2 w-full items-center justify-center">
                            <MintToken />

                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mt-5 sm:mt-6"
                                onClick = {decryptContent}
                            >
                                Decrypt Post
                            </button>
                        </div>
                    </>
                }
            
                </div>
            </Modal>
            <article className="prose px-36 py-20 w-full max-w-none">
            
            <ReactMarkdown>
                {decryptedContent}
            </ReactMarkdown>
           
            </article>
        </div>
     
    )
}