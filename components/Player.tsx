'use client'

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";


// player
const Player = () => {
    // player hook
    const player = usePlayer() 
    // get songs hook
    const { song } = useGetSongById(player.activeId)
    // load song hook
    const songUrl = useLoadSongUrl(song!)

    // if not song, song url or player active id
    if(!song || !songUrl || !player.activeId) return null

    // render component
    return (
        <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
            <PlayerContent
                key={songUrl}
                song={song}
                songUrl={songUrl}
            />
        </div>
    );
}
 
export default Player;
