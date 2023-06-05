import { Song } from "@/types"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"


// get song by id hook
const useGetSongById = (id?: string) => {
    // loading state
    const [isLoading, setIsLoading] = useState(false)
    // song state
    const [song, setSong] = useState<Song | undefined>(undefined)
    // get supabase client
    const { supabaseClient } = useSessionContext()

    // useEffect to fetch the song
    useEffect(() => {
        // if not id
        if(!id) return

        // loading to true
        setIsLoading(true)

        // fetch data
        const fetchSong = async () => {
            // get song from supabase
            const { data, error } = await supabaseClient.from('songs').select('*').eq(
                'id', id
            ).single()

            // if any error
            if(error) {
                // set loading to false
                setIsLoading(false)

                // return toast error
                return toast.error(error.message)
            }

            // set song data
            setSong(data as Song)
            // set loading to false
            setIsLoading(false)
        }

        fetchSong()
    } , [id, supabaseClient])

    // return useMemo
    return useMemo(() => ({
        isLoading, song
    }), [isLoading, song])
}

export default useGetSongById
