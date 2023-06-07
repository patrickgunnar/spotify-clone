'use client'

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import Image from "next/image";


interface MediaItemProps {
    data: Song
    onClick?: (id: string) => void
}

const MediaItem: React.FC<MediaItemProps> = ({
    data, onClick
}) => {
    // get player
    const player = usePlayer()
    // get image url
    const imageUrl = useLoadImage(data)

    // handle click
    const handleClick = () => {
        // if onClick
        if(onClick) return onClick(data.id)

        // turn on player
        return player.setId(data.id)
    }

    // return media item
    return (
        <div className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
            onClick={handleClick}
        >
            <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
                <Image className="object-cover"
                    src={imageUrl || '/images/liked.png'}
                    alt="Media Item"
                    fill
                />
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate">
                    {data.title}
                </p>
                <p className="text-neutral-400 text-sm truncate">
                    {data.author}
                </p>
            </div>
        </div>
    );
}
 
export default MediaItem;
