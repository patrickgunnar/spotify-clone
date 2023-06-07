import { create } from "zustand";


interface SubscribeModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

// subscribe modal
// isOpen is false by default
// onOpen set isOpen to true
// onClose set isOpen to false
const useSubscribeModal = create<SubscribeModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useSubscribeModal

