'use client'

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface LikedContentProps {
    songs: Song[]
}

// like content
const LikedContent: React.FC<LikedContentProps> = ({
    songs
}) => {
    // get router
    const router = useRouter()
    // get user and isLoading from useUser hook
    const { isLoading, user } = useUser()
    // onPlay hook
    const onPlay = useOnPlay(songs)

    // redirects the user if not login
    useEffect(() => {
        // if is not loading
        if(!isLoading && !user) router.replace('/')
    }, [isLoading, user, router])

    // if no liked songs
    if(songs.length === 0) return (
        <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
            No liked songs.
        </div>
    )

    // render component
    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {
                songs.map((item) => (
                    <div className="flex items-center gap-x-4 w-full"
                        key={item.id}
                    >
                        <div className="flex-1">
                            <MediaItem
                                onClick={(id: string) => onPlay(id)}
                                data={item}
                            />
                        </div>
                        <LikeButton songId={item.id} />
                    </div>
                ))
            }
        </div>
    );
}
 
export default LikedContent;
