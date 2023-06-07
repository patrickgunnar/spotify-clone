import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";


const useOnPlay = (songs: Song[]) => {
    // get player hook
    const player = usePlayer()
    // get auth modal
    const authModal = useAuthModal()
    // subscribe modal
    const subscribeModal = useSubscribeModal()
    // get user from useUser hook
    const { user, subscription } = useUser()

    // player handler
    const onPlay = (id: string) => {
        // if not user
        if(!user) return authModal.onOpen()
        // if not subscription
        if(!subscription) return subscribeModal.onOpen()

        // set player id
        player.setId(id)
        // set player ids
        player.setIds(songs.map(song => song.id))
    }

    return onPlay
}

export default useOnPlay
