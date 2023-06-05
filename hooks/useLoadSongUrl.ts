import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";


// use load song hook
const useLoadSongUrl = (song: Song) => {
    // get supabase client
    const supabaseClient = useSupabaseClient()

    // if not song
    if(!song) return ''

    // get song from supabase
    const { data:songData } = supabaseClient.storage.from('songs').getPublicUrl(
        song.song_path
    )

    return songData.publicUrl
}

export default useLoadSongUrl
