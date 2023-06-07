'use client'

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast"
import usePlayer from "@/hooks/usePlayer";


interface HeaderProps {
    children: React.ReactNode
    className?: string
}

// header
const Header: React.FC<HeaderProps> = ({
    children, className
}) => {
    // get router
    const router = useRouter()
    // auth modal hook
    const authModal = useAuthModal()
    // get supabase client
    const supabaseClient = useSupabaseClient()
    // get user from useUser hook
    const { user } = useUser()
    // get player 
    const player = usePlayer()

    // handle logout
    const handleLogout = async () => {
        // get any errors on sign out
        const { error } = await supabaseClient.auth.signOut()

        // resert any playing songs
        player.reset()

        // refresh page
        router.refresh()

        // if error
        // else logged out with success
        if(error) toast.error(error.message)
        else toast.success('logged out')
    }

    // render elements
    return (
        <div className={twMerge(
            'h-fit bg-gradient-to-b from-emerald-800 p-6',
            className
        )}>
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 items-center">
                    <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
                        type="button" title="Back" onClick={() => router.back()}
                    >
                        <RxCaretLeft className="text-white"
                            size={35}
                        />
                    </button>
                    <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
                        type="button" title="Forward" onClick={() => router.forward()}
                    >
                        <RxCaretRight className="text-white"
                            size={35}
                        />
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
                        type="button" title="Home"
                    >
                        <HiHome className="text-black"
                            size={20}
                        />
                    </button>
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
                        type="button" title="Search"
                    >
                        <BiSearch className="text-black"
                            size={20}
                        />
                    </button>
                </div>
                <div className="flex justify-center items-center gap-x-4">
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <Button className="bg-white px-6 py-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                            <Button className="bg-white"
                                onClick={() => router.push('/account')}
                            >
                                <FaUserAlt />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Button className="bg-transparent text-neutral-300 font-medium"
                                    onClick={authModal.onOpen}
                                >
                                    Sign up
                                </Button>
                            </div>
                            <div>
                                <Button className="bg-white px-6 py-2"
                                    onClick={authModal.onOpen}
                                >
                                    Log in
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}
 
export default Header;
