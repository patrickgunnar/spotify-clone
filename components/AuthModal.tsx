'use client'

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";


// auth modal
const AuthModal = () => {
    // get supabase client
    const supabaseClient = useSupabaseClient()
    // router
    const router = useRouter()
    // get session from context
    const { session } = useSessionContext()
    // get onClose annd isOpen from auth modal hook
    const { onClose, isOpen } = useAuthModal()

    // close the modal once its logged in
    useEffect(() => {
        // if exists a session
        if(session) {
            // refresh the page
            router.refresh()
            // close modal
            onClose()
        }
    }, [session, router, onClose])

    // on close handle
    const onChange = (open: boolean) => {
        // if not open
        if(!open) onClose()
    }

    // render modal
    return (
        <Modal
            title="Welcome back"
            description="Login to your account"
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                supabaseClient={supabaseClient}
                theme="dark"
                providers={['github']}
                magicLink
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#404040',
                                brandAccent: '#22c55e'
                            }
                        }
                    }
                }}
            />
        </Modal>
    );
}
 
export default AuthModal;
