import { create } from "zustand"


interface PlayerStore {
    ids: string[]
    activeId?: string
    setId: (id: string) => void
    setIds: (ids: string[]) => void
    reset: () => void
}

// usePlayer hook
// receives a list of ids - songs to play
// the current clicked id - that is playing
// current setter
// playlist setter
// reset handler
const usePlayer = create<PlayerStore>((set) => ({
    ids: [], activeId: undefined,
    setId: (id: string) => set({ activeId: id }),
    setIds: (ids: string[]) => set({ ids: ids }),
    reset: () => set({ ids: [], activeId: undefined })
}))

export default usePlayer
