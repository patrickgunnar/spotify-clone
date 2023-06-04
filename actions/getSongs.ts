import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getSongs = async (): Promise<Song[]> => {
    // supabase server component client
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    // fetch songs
    const { data, error } = await supabase.from('songs').select('*').order(
        'created_at', { ascending: false }
    )

    // if error
    if(error) console.log(error)

    return (data as any) || []
}

export default getSongs
