export const setDefaultProfile =`
mutation CreateSetDefaultProfileTypedData(
$profileId: ProfileId!
){createSetDefaultProfileTypedData(request: { profileId: $profileId}) {
  id
  expiresAt
  typedData {
    types {
      SetDefaultProfileWithSig {
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
      wallet
      profileId
    }
  }
}
}
`