import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserInfo = create(persist((set) => ({
    userAddress: null,
    profile: null,
    setUserAddress: (address) => set({ userAddress: address }),
    setProfile: (profile) => set({ profile: profile }),
})))


