'use client'

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai"; 
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSubscribeModal from "@/hooks/useSubscribeModal";


interface LibraryProps {
    songs: Song[]
}

// library
const Library: React.FC<LibraryProps> = ({
    songs
}) => {
    // auth modal
    const authModal = useAuthModal()
    // subscribe modal
    const subscribeModal = useSubscribeModal()
    // upload modal
    const uploadModal = useUploadModal()
    // get user
    const { user, subscription } = useUser()
    // onPlay hook
    const onPlay = useOnPlay(songs)
    
    // handle upload modal
    const onClick = () => {
        // if not user
        if(!user) return authModal.onOpen()

        // if not subscription
        if(!subscription) return subscribeModal.onOpen()

        // open upload modal
        return uploadModal.onOpen()
    }

    // render elements
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400"
                        size={26}
                    />
                    <p className="text-neutral-400 font-medium text-md">
                        Your Library
                    </p>
                </div>
                <AiOutlinePlus className="text-neutral-400 cursor-pointer hover:text-white transition"
                    onClick={onClick}
                    size={20}
                />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
                {
                    songs.map((item) => (
                        <MediaItem
                            key={item.id}
                            onClick={(id: string) => onPlay(id)}
                            data={item}
                        />
                    ))
                }
            </div>
        </div>
    );
}
 
export default Library;
