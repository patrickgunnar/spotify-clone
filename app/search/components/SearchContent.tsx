'use client'

import MediaItem from "@/components/MediaItem";
import { Song } from "@/types";


interface SearchContentProps {
    songs: Song[]
}

// serach content
const SearchContent: React.FC<SearchContentProps> = ({
    songs
}) => {
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
                                onClick={() => {}}
                                data={item}
                            />
                        </div>
                        {/* ADD LIKE BUTTON HERE */}
                    </div>
                ))
            }
        </div>
    );
}
 
export default SearchContent;
