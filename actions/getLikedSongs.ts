import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getLikedSongs = async (): Promise<Song[]> => {
    // supabase server component client
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    // get the session
    const {
        data: { session }
    } = await supabase.auth.getSession()

    // fetch songs
    const { data, error } = await supabase.from('liked_songs').select('*, songs(*)').eq(
        'user_id', session?.user?.id
    ).order('created_at', { ascending: false })

    // if error
    if(error) {
        console.log(error)

        return []
    }

    // if not data
    if(!data) return []

    return data.map((item) => ({
        ...item.songs
    }))
}

export default getLikedSongs
