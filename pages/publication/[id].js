import React from 'react';
import { urqlQuery } from '../../api';
import {useEffect, useState} from 'react';
import {getPublication} from '../../api/queries/getPublication';
import ReactMarkdown from 'react-markdown'
import lit from '../../lib/lit'

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
            const [isEncrypted, encryptedSymmetricKey] =  checkPublicationForEncryptedContent(pub)
            if (isEncrypted) {
                return <EncryptedPost publication = {pub} encryptedSymmetricKey = {encryptedSymmetricKey} />
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
        publication.metadata.attributes.forEach((attr) => {
          if(attr.traitType === 'encryptedSymmetricKey'){
            isEncrypted = true
            encryptedSymmetricKey = attr.value
          }
          
        })
        return [isEncrypted, encryptedSymmetricKey]
    }
    
    
   
    return(

        <div>
            {displayPublication()}
            
        </div>

    )

}

function EncryptedPost({publication, encryptedSymmetricKey}){
  
    const [decryptedContent, setDecryptedContent] = useState('')
    
    async function decryptContent(){
      console.log('decrypting content...')
      console.log(publication)
      let encryptedString = publication.metadata.content
      const encryptedBlob = await (await fetch(encryptedString)).blob()
      let decryption =  await lit.decryptText(encryptedBlob, encryptedSymmetricKey)
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