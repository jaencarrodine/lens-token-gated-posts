export const doesFollow = `
  query($request: DoesFollowRequest!) {
    doesFollow(request: $request) { 
      followerAddress
      profileId
      follows
    }
  }
`