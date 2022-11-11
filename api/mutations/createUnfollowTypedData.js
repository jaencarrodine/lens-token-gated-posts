export const createUnfollowTypedData = `
mutation($request: UnfollowRequest!) { 
  createUnfollowTypedData(request: $request) {
    id
    expiresAt
    typedData {
      domain {
        name
        chainId
        version
        verifyingContract
      }
      types {
        BurnWithSig {
          name
          type
        }
      }
      value {
        nonce
        deadline
        tokenId
      }
    }
  }
}
`