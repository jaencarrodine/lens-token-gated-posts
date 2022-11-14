import React from 'react';
import {uploadPostToIPFS} from '../../utils/uploadPostToIPFS'
import {usePost} from '../../store/usePost'
import {useUserInfo} from '../../store/useUserInfo'
import { urqlMutation } from '../../api';
import {createPostTypedData} from '../../api/mutations/createPostTypedData';
import {signedTypeData} from '../../utils/signedTypeData'
import { splitSignature } from '../../utils/splitSignature';
import {useContractWrite, useSigner, useSignMessage} from 'wagmi'
import {LENS_HUB_CONTRACT_ADDRESS}from '../../constants';
import LENSHUB_ABI from '../../abi/lenshub.json'
import { useAccessControlData } from '../../store/useAccessControlData';

//TODO error handling for post upload
export default function SendPost(){
    
    const postContent = usePost(state => state.postContent)
    const profile = useUserInfo(state => state.profile)
    const userAddress = useUserInfo(state => state.userAddress)
    const accessControlConditions = useAccessControlData(state => state.accessControlConditions)
    const encryptSignatureMessage = 'Sign this message to encrypt the post'
    //can add error handling here i think
    const {
        error,
        isLoading: writeLoading,
        writeAsync
      } = useContractWrite({
        address:LENS_HUB_CONTRACT_ADDRESS,
        abi:LENSHUB_ABI,
        functionName: 'postWithSig',
        mode: 'recklesslyUnprepared',
    });
    const {signMessageAsync} = useSignMessage({
        message:encryptSignatureMessage
    })

    const { data: signer, isError, isLoading } = useSigner()

    const handleClick = async () => {
        savePost()
        
    }

    async function savePost() {
        //add check to make sure user is signed in
        //add check to make sure access controls exist
        console.log('saving post...')
        const signData = {
            userAddress: userAddress,
            message: encryptSignatureMessage,
            signMessageAsync: signMessageAsync
        }
        const encryptionData = {
            stringToEncrypt: postContent,
            accessControlConditions: accessControlConditions,
        }
        const ipfsResult= await uploadPostToIPFS(encryptionData, profile, signData)
        console.log('ipfsResult: ', ipfsResult)
        const signedResult = await urqlMutation(createPostTypedData, {
            profileId: profile.id,
            contentURI: 'ipfs://' + ipfsResult.path,
        })
        console.log('signedResult: ', signedResult)

        const typedData = signedResult.data.createPostTypedData.typedData;

        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value, signer)
        const { v, r, s } = splitSignature(signature);

        const inputData = {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        };

        const tx = await writeAsync({recklesslySetUnpreparedArgs: [inputData]})
       
    }

    return(
        <button class="btn btn-outline btn-primary" onClick = {handleClick}>Post</button>
    )

}