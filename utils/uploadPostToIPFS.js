import lit from '../lib/lit';
import { v4 as uuid } from 'uuid'
import { create } from 'ipfs-http-client'

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;   // <---------- your Infura Project ID

const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export async function uploadPostToIPFS(postInfo,profile, signData) {
  console.log('profile: ', profile)
    let stringToEncrypt = postInfo.stringToEncrypt
    let accessControlConditions = postInfo.accessControlConditions
    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(stringToEncrypt, accessControlConditions, signData)
    const blobToBase64 = blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      };
    const encryptedContentString = await blobToBase64(encryptedString);
   
    const metaData = {
        version: '2.0.0',
        mainContentFocus: 'TEXT_ONLY',
        metadata_id: uuid(),
        description: 'Encrypted Lens post',
        locale: 'en-US',
        content: encryptedContentString,
        external_url: `https://lenster.xyz/u/${profile.handle}`,
        image: null,
        imageMimeType: null,
        name: 'Name',
        attributes: [
            {
            traitType: "string",
            key: "type",
            value: "post",
            },
            {
                traitType: "encryptedSymmetricKey",
                value: encryptedSymmetricKey,
            },
            {
                traitType: "accessControlConditions",
                value: JSON.stringify(accessControlConditions),
            }
        ],
        tags: ['using_api_examples'],
        appId: 'jaen',
    };

    const ipfsResult = await client.add(JSON.stringify(metaData))

    return ipfsResult
}