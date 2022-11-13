// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.


class AlchemyAPI {
    constructor(network) {
        this.alchemy = new Alchemy({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, 
            network: Network[network], 
        })
    }

    async getNftCollectionData(contractAddress) {
        let collectionData =  this.alchemy.nft.getContractMetadata(contractAddress).then((data) => {
            return data
        }).catch((error) => {
            console.log(error)
            return null
        })
        if(collectionData.name !== '') {
            return collectionData
        }else {
            return null
        }
    }



}

export default AlchemyAPI


//NETWORKS
// ARB_GOERLI
// : 
// "arb-goerli"
// ARB_MAINNET
// : 
// "arb-mainnet"
// ARB_RINKEBY
// : 
// "arb-rinkeby"
// ASTAR_MAINNET
// : 
// "astar-mainnet"
// ETH_GOERLI
// : 
// "eth-goerli"
// ETH_KOVAN
// : 
// "eth-kovan"
// ETH_MAINNET
// : 
// "eth-mainnet"
// ETH_RINKEBY
// : 
// "eth-rinkeby"
// ETH_ROPSTEN
// : 
// "eth-ropsten"
// MATIC_MAINNET
// : 
// "polygon-mainnet"
// MATIC_MUMBAI
// : 
// "polygon-mumbai"
// OPT_GOERLI
// : 
// "opt-goerli"
// OPT_KOVAN
// : 
// "opt-kovan"
// OPT_MAINNET
// : 
// "opt-mainnet"