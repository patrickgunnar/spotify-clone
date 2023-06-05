'use client'

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";


interface LikeButtonProps {
    songId: string
}

// like button
const LikeButton: React.FC<LikeButtonProps> = ({
    songId
}) => {
    // get router
    const router = useRouter()
    // supabase client from session context
    const { supabaseClient } = useSessionContext()
    // auth modal
    const authModal = useAuthModal()
    // user 
    const { user } = useUser()

    // like state
    const [isLiked, setIsLiked] = useState(false)

    // check if song is like or not
    useEffect(() => {
        // if not user id
        if(!user?.id) return

        // fetching data 
        const fetchData = async () => {
            // get song's i from supabase liked songs table
            const { data, error } = await supabaseClient.from('liked_songs').select('*').eq(
                'user_id', user.id
            ).eq('song_id', songId).single()

            // if not error and have the date
            if(!error && data) setIsLiked(true)
        }

        fetchData()
    }, [songId, supabaseClient, user?.id])

    // render liked icon or not like icon
    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    // like handler
    const handleLike = async () => {
        // if not user
        if(!user) return authModal.onOpen()

        // is a liked song
        if(isLiked) {
            // delete like from the table
            const { error } = await supabaseClient.from('liked_songs').delete().eq(
                'user_id', user.id
            ).eq('song_id', songId)

            // if any error
            if(error) toast.error(error.message)
            // else set state to false
            else setIsLiked(false)
        } else { // if not liked
            // insert like to the table
            const { error } = await supabaseClient.from('liked_songs').insert({
                song_id: songId,
                user_id: user.id
            })

            // if any error
            if(error) toast.error(error.message)
            // else set state to true
            else {
                setIsLiked(true)
                // success msg
                toast.success('Liked!')
            }
        }

        // refresh page
        router.refresh()
    }

    // render elements
    return (
        <button className="hover:opacity-75 transition"
            type="button" title="Like Button" onClick={handleLike}
        >
            <Icon color={isLiked ? '#22c55e' : 'white'} 
                size={25}
            />
        </button>
    );
}
 
export default LikeButton;
