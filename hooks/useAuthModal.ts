import { create } from "zustand";


interface AuthModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

// auth modal
// isOpen is false by default
// onOpen set isOpen to true
// onClose set isOpen to false
const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useAuthModal
