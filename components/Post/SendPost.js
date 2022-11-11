import React from 'react';
import {uploadPostToIPFS} from '../../utils/uploadPostToIPFS'
import {usePost} from '../../store/usePost'
import {useUserInfo} from '../../store/useUserInfo'
import { urqlMutation } from '../../api';
import {createPostTypedData} from '../../api/mutations/createPostTypedData';
import {signedTypeData} from '../../utils/signedTypeData'
import { splitSignature } from '../../utils/splitSignature';
import {useContractWrite, useSigner} from 'wagmi'
import {LENS_HUB_CONTRACT_ADDRESS}from '../../constants';
import LENSHUB_ABI from '../../abi/lenshub.json'

//TODO error handling for post upload
export default function SendPost(){
    
    const postContent = usePost(state => state.postContent)
    const profile = useUserInfo(state => state.profile)
   
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

    const { data: signer, isError, isLoading } = useSigner()

    const handleClick = async () => {
        savePost()
        
    }

    async function savePost() {
        console.log('saving post...')
        const ipfsResult= await uploadPostToIPFS({stringToEncrypt:postContent}, profile)
        const signedResult = await urqlMutation(createPostTypedData, {
            profileId: profile.id,
            contentURI: 'ipfs://' + ipfsResult.path,
        })

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