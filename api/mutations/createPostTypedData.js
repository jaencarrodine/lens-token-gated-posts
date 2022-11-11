export const createPostTypedData = `
mutation CreatePostTypedData(
$profileId: ProfileId!, $contentURI: Url!
){createPostTypedData(request: {
  profileId: $profileId,
  contentURI: $contentURI,
  collectModule: {
    revertCollectModule: true
  },
  referenceModule: {
    followerOnlyReferenceModule: false
  }
}) {
  id
  expiresAt
  typedData {
    types {
      PostWithSig {
        name
        type
      }
    }
    domain {
      name
      chainId
      version
      verifyingContract
    }
    value {
      nonce
      deadline
      profileId
      contentURI
      collectModule
      collectModuleInitData
      referenceModule
      referenceModuleInitData
    }
  }
}
}
`