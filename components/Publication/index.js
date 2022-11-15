import React from 'react';
import { urqlQuery } from '../../api';
import {useEffect, useState} from 'react';
import {getPublication} from '../../api/queries/getPublication';
import ReactMarkdown from 'react-markdown'
import EncryptedPost from './EncryptedPost';

export default function Publication({publicationId}){
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







