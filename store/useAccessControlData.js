import create from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set) => ({
    accessControlConditions:[],
    addAccessControlCondition: (condition) => set(state => ({ accessControlConditions: [...state.accessControlConditions, condition] })),
    removeAccessControlConditionByIndex: (index) => set(state => {
        const newConditions = [...state.accessControlConditions]
        newConditions.splice(index, 1)
        return { accessControlConditions: newConditions }
    }),
    setAccessControlConditions: (conditions) => set({ accessControlConditions: conditions }),

    
})


export const useAccessControlData = create(devtools(store))
