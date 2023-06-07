'use client'

import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";


// account settings
const AccountContent = () => {
    // get router
    const router = useRouter()
    // subscribe modal
    const subscribeModal = useSubscribeModal()
    // get user, loading state and subscribe from useUser
    const { user, isLoading, subscription } = useUser()

    // loading state
    const [loading, setLoading] = useState(false)

    // redirect to home page if user not login
    useEffect(() => {
        // if not isLoading and user
        if(!isLoading && !user) router.replace('/')
    }, [isLoading, user, router])

    // redirect to customer portal handler
    const redirectToCustomerPortal = async () => {
        // set laoding
        setLoading(true)

        try {
            // get url and error from post data
            const { url, error } = await postData({
                url: '/api/create-portal-link'
            })

            // assign window location
            window.location.assign(url)
        } catch (error) {
            // if error
            toast.error((error as Error).message)
            // set loading
            setLoading(false)
        }
    }

    // render elements
    return (
        <div className="mb-7 px-6">
            {
                !subscription && (
                    <div className="flex flex-col gap-y-4">
                        <p>No active plan.</p>
                        <Button className="w-[300px]"
                            onClick={subscribeModal.onOpen}
                        >
                            Subscribe
                        </Button>
                    </div>
                )
            }
            {
                subscription && (
                    <div className="flex flex-col gap-y-4">
                        <p>
                            You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.
                        </p>
                        <Button className="w-[300px]"
                            disabled={loading || isLoading}
                            onClick={redirectToCustomerPortal}
                        >
                            Open customer portal
                        </Button>
                    </div>
                )
            }
        </div>
    );
}
 
export default AccountContent;
