import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getSongsByUserId = async (): Promise<Song[]> => {
    // supabase server component client
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    // get session
    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession()

    // if session error
    if(sessionError) {
        // console error
        console.log(sessionError.message)

        return []
    }

    // get user uploaded songs
    const { data, error } = await supabase.from('songs').select('*').eq(
        'user_id', sessionData.session?.user.id
    ).order('created_at', { ascending: false })

    // if any error
    if(error) console.log(error.message)

    return (data as any) || []
}

export default getSongsByUserId
