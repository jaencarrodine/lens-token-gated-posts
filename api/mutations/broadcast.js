export const broadcast = `
  mutation Broadcast($request: BroadcastRequest!) {
      broadcast(request: $request) {
          ... on RelayerResult {
              txHash
          }
          ... on RelayError {
              reason
          }
      }
  }
`