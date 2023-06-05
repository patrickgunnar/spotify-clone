import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";


const useOnPlay = (songs: Song[]) => {
    // get player hook
    const player = usePlayer()
    // get auth modal
    const authModal = useAuthModal()
    // get user from useUser hook
    const { user } = useUser()

    // player handler
    const onPlay = (id: string) => {
        // if not user
        if(!user) return authModal.onOpen()

        // set player id
        player.setId(id)
        // set player ids
        player.setIds(songs.map(song => song.id))
    }

    return onPlay
}

export default useOnPlay
