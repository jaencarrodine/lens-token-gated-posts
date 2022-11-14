import React from 'react';
import { urqlQuery } from '../../api';
import {useEffect, useState} from 'react';
import {getPublication} from '../../api/queries/getPublication';
import ReactMarkdown from 'react-markdown'
import lit from '../../lib/lit'
import { useSignMessage } from 'wagmi';
import { useUserInfo } from '../../store/useUserInfo';
export default function publication({publicationId}){
    const [publication, setPublication] = useState(null)
    useEffect(() => {
        getPost()
    },[])

    async function getPost(){
        console.log('publicationId: ', publicationId)
        let publication = await urqlQuery(getPublication, {publicationId: publicationId.toString() })
        console.log('pub', publication)
        setPublication(publication.data.publication)
        return publication
    }
  
    function displayPublication(){
        if(publication){
            const pub = publication
            const [isEncrypted, encryptedSymmetricKey, accessControlConditions] =  checkPublicationForEncryptedContent(pub)
            if (isEncrypted) {
                return <EncryptedPost publication = {pub} encryptedSymmetricKey = {encryptedSymmetricKey} accessControlConditions = {accessControlConditions}/>
            }else{
                return (
                    <div className={publicationWrapper} >
                        <ReactMarkdown>
                            {pub.metadata.content}
            
                        </ReactMarkdown>
                    </div>
                )
          
            }
        }

      
    }

    function checkPublicationForEncryptedContent(publication){
        let isEncrypted = false
        let encryptedSymmetricKey = null
        let accessControlConditions = null
        publication.metadata.attributes.forEach((attr) => {
          if(attr.traitType === 'encryptedSymmetricKey'){
            isEncrypted = true
            encryptedSymmetricKey = attr.value
            
          }
          if(attr.traitType === 'accessControlConditions'){
            accessControlConditions = JSON.parse(attr.value)
          }
          
        })
        return [isEncrypted, encryptedSymmetricKey, accessControlConditions]
    }
    
    
   
    return(

        <div>
            {displayPublication()}
            
        </div>

    )

}

function EncryptedPost({publication, encryptedSymmetricKey, accessControlConditions}){
  
    const [decryptedContent, setDecryptedContent] = useState('')
    const message = 'Sign this message to decrypt the post'
    const {signMessageAsync} = useSignMessage({
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
    }
  
    return (
      <div  >
          Encrypted content
          <ReactMarkdown>
            {decryptedContent}
          </ReactMarkdown>
          <button onClick = {decryptContent}>Decrypt</button>
      </div>
    )
}


export async function getServerSideProps({ params }) {
    //fetch publication data form the lens api
 
    return {
        props: {
            publicationId: params.id,
        },
    };
}