import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";


const useLoadImage = (song: Song) => {
    // supabase client
    const supabaseClient = useSupabaseClient()

    // if not song
    if(!song) return null

    // get image data
    const { data: imageData } = supabaseClient.storage.from('images').getPublicUrl(
        song.image_path
    )

    // return public image url
    return imageData.publicUrl
}

export default useLoadImage
