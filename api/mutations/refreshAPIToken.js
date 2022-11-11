export const refreshAPIToken = `
mutation Refresh(
  $refreshToken: Jwt!
) {
  refresh(request: {
    refreshToken: $refreshToken
  }) {
    accessToken
    refreshToken
  }
}
`