export const authenticate = `
mutation Authenticate(
  $address: EthereumAddress!
  $signature: Signature!
) {
  authenticate(request: {
    address: $address,
    signature: $signature
  }) {
    accessToken
    refreshToken
  }
}
`