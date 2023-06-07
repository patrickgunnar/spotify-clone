import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";


export async function POST() {
    try {
        // create client route handler
        const supabase = createRouteHandlerClient({ cookies})

        // get user from supabase
        const { data: { user } } = await supabase.auth.getUser()

        // if not user
        if(!user) throw new Error('Could not get user!')

        // create or retrieve customer
        const customer = await createOrRetrieveCustomer({
            uuid: user.id || '',
            email: user.email || ''
        })

        // if not customer
        if(!customer) throw new Error('Could not get customer!')

        // get url
        const { url } = await stripe.billingPortal.sessions.create({
            customer, return_url: `${getURL()}/account`
        })

        return NextResponse.json({ url })
    } catch (error: any) {
        console.log(error)

        // return next response
        return new NextResponse('Internal Error', { status: 500 })
    }
}
