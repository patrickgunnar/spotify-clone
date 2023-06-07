import { Subscription, UserDetails } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";

// user context type
type UserContextType = {
    accessToken: string | null
    user: User | null
    userDetails: UserDetails | null
    isLoading: boolean
    subscription: Subscription | null
}

// create context
export const UserContext = createContext<UserContextType | undefined>(undefined)

// prop's interface
export interface Props {
    [propName: string]: any
}

// user context provider
export const MyUserContextProvider = (props: Props) => {
    // get session, isLoading and supabase client from session context
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext()
    // get user from supabase
    const user = useSupaUser()
    // get access token from session
    const accessToken = session?.access_token ?? null

    // loading state
    const [isLoadingData, setIsloadingData] = useState(false)
    // user details state
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    // subscription state
    const [subscription, setSubscription] = useState<Subscription | null>(null)

    // get user details from supabase
    const getUserDetails = () => supabase.from('users').select('*').single()
    // get user subscription from supabase
    const getSubscription = () => supabase.from('subscriptions').select(
        '*, prices(*, products(*))'
    ).in('status', ['trialing', 'active']).single()

    // fetch the information
    useEffect(() => {
        // if logged in and not loading data and 
        // not user details and not subscription
        if(user && !isLoadingData && !userDetails && !subscription) {
            // loading data to true
            setIsloadingData(true)

            // get user details and subscription
            Promise.allSettled([getUserDetails(), getSubscription()])
                .then((results) => {
                    // user details
                    const userDetailsPromise = results[0]
                    // subscription details
                    const subscriptionPromise = results[1]

                    // if user details status is fulfilled
                    if(userDetailsPromise.status === 'fulfilled') {
                        // userDetails state to userDetailsPromise value data
                        setUserDetails(userDetailsPromise.value.data as UserDetails)
                    }

                    // if subscription status is fulfilled
                    if(subscriptionPromise.status === 'fulfilled') {
                        // subscription state to subscriptionPromise value data
                        setSubscription(subscriptionPromise.value.data as Subscription)
                    }

                    // loading data to false
                    setIsloadingData(false)
                })
            // if not user, loading user or loading data
        } else if(!user && !isLoadingUser && !isLoadingData) {
            // reset the data
            setUserDetails(null)
            setSubscription(null)
        }
    }, [user, isLoadingUser])

    // value receives accessToken, user
    // userDetails, subscription and 
    // isLoading, which is isLoadingUser or isLoadingData
    const value = {
        accessToken, user, userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    }

    // return user context provider
    return <UserContext.Provider value={value} {...props} />
}

// useUser hook
export const useUser = () => {
    // context
    const context = useContext(UserContext)

    // if context is undefined
    if(context === undefined) throw new Error('useUser must be used within MyUserContextProvider')

    return context
}
