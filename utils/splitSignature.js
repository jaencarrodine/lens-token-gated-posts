import { ethers, utils } from 'ethers'

export function splitSignature(signature) {
    return utils.splitSignature(signature)
}