import React from 'react';

export default function Spinner({size, color, background}){

    return(
        <div role="status">
            <svg aria-hidden="true" class={`mr-2 w-${size} h-${size} text-${background} animate-spin  fill-secondary `} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
    )
}

/*Hey! 
Hey! 
Thanks for checking out this proof of concept.
 
# So I encrypted this post; what's the big deal?
Posting content to an open social graph is great. It allows unrestricted access to all the content and information, enabling developers to build any application they can imagine. But sometimes, you don't want all of your content to be accessible to anyone. This is why private profiles exist in web 2 social media.

**But how do you create restricted access content on an open social graph while preserving interoperability?**

By encrypting the post content and enabling token-gated access controls via [Lit Protocol](https://litprotocol.com/) private content could be viewed in any application so long as the user has the correct permissions.

This enables a variety of features, including but not limited to the following:
- Private profiles
- Private posts
- Pay to unlock posts
- Token-gated posts
- Token-gated file download embeds

These features also enable a variety of monetization and growth opportunities for creators. For example, a creator could set a post collection price of 2 Matic and require followers to collect the post to view it.




# Brief technical overview

As I mentioned, content encryption and decryption are handled by lit protocol. First, we pass the markdown string and our desired access controls to Lit via the Lit SDK to encrypt the content. Lit then returns our encrypted text and an encrypted access key. Finally, we save the encrypted text to the "content" section of the post metadata and hold the access controls and encrypted access key in the "attributes" section. 

When we want to decrypt the content. The decrypting wallet can pass the encrypted string, access controls, encrypted access key, and their wallet signature to the Lit SDK. The decrypted content is only returned if the signing wallet meets the access controls, i.e., owns the required NFT. 

**Thus, the content can be decrypted on any lens application where the devs choose to implement the Lit SDK.**

Thanks again for taking the time to check out this project!

If anyone reading this can(or knows someone who can) get me whitelisted to create a lens profile, it would be greatly appreciated. 

I'll deploy this app to the Polygon Mainnet when it's ready.

Any ideas or recommendations are greatly appreciated. 

You can follow me on [Twitter](https://twitter.com/jaencarrodine) (and hopfully on lens soon) for updates!*/