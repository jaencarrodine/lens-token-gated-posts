import create from 'zustand'


export const usePost = create((set) => ({
    postContent: `## Use markdown to write your post here\nWhen you're finished, use the post button to encrypt the content and post it to Lens.  You can use the access control button to decide who will be able to decrypt the post. \n\n\n\n`,
    setPostContent: (content) => set({ postContent: content }),

    
}))