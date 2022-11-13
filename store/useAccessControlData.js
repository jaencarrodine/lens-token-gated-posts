import create from 'zustand'


export const useAccessControlData = create((set) => ({
    accessControlConditions:[],
    addAccessControlCondition: (condition) => set(state => ({ accessControlConditions: [...state.accessControlConditions, condition] })),
    removeAccessControlConditionByIndex: (index) => set(state => {
        const newConditions = [...state.accessControlConditions]
        newConditions.splice(index, 1)
        return { accessControlConditions: newConditions }
    }),
    setAccessControlConditions: (conditions) => set({ accessControlConditions: conditions }),

    
}))

