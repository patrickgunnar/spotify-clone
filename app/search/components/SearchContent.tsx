'use client'

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";


interface SearchContentProps {
    songs: Song[]
}

// serach content
const SearchContent: React.FC<SearchContentProps> = ({
    songs
}) => {
    // onPlay hook
    const onPlay = useOnPlay(songs)

    // if no songs
    if(songs.length === 0) return (
        <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
            No songs found.
        </div>
    )

    // render elements
    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
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
                        <LikeButton
                            songId={item.id}
                        />
                    </div>
                ))
            }
        </div>
    );
}
 
export default SearchContent;
