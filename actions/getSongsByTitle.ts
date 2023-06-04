import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";


const getSongsByTitle = async (searchData: string): Promise<Song[]> => {
    // supabase server component client
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    // if not searchData
    if(!searchData) {
        // get all songs
        const allSongs = await getSongs()

        // return songs
        return allSongs
    }

    // fetch songs
    const { data, error } = await supabase.from('songs').select('*').ilike(
        'title', `%${searchData}%`
    ).order('created_at', { ascending: false })

    // if error
    if(error) console.log(error)

    return (data as any) || []
}

export default getSongsByTitle
