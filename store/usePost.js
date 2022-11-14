import create from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set) => ({
    postContent: `## Use markdown to write your post here\nWhen you're finished, use the post button to encrypt the content and post it to Lens.  You can use the access control button to decide who will be able to decrypt the post. \n\n\n\n`,
    setPostContent: (content) => set({ postContent: content }),
    postTitle: '',
    setPostTitle: (title) => set({ postTitle: title }),
    postDescription: '',
    setPostDescription: (description) => set({ postDescription: description }),
})


export const usePost = create(devtools(store))