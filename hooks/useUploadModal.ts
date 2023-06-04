import { create } from "zustand";


interface UploadModalModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

// upload modal
// isOpen is false by default
// onOpen set isOpen to true
// onClose set isOpen to false
const useUploadModal = create<UploadModalModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useUploadModal
