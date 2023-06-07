import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";


export async function POST(request: Request) {
    // get the product body: price, quaantity, metadata
    const { price, quantity = 1, metadata = {} } = await request.json()

    try {
        // create supabase route client
        const supabase = createRouteHandlerClient({ cookies })

        // get user from supabase
        const { data: { user } } = await supabase.auth.getUser()

        // create or retrieve customer
        const customer = await createOrRetrieveCustomer({
            uuid: user?.id || '',
            email: user?.email || ''
        })

        // create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer, line_items: [
                {
                    price: price.id,
                    quantity
                }
            ],
            mode: 'subscription', allow_promotion_codes: true,
            subscription_data: {
                trial_from_plan: true, metadata
            },
            success_url: `${getURL()}/account`,
            cancel_url: `${getURL()}`
        })

        return NextResponse.json({ sessionId: session.id })
    } catch (error: any) {
        console.log(error)

        // return next response error
        return new NextResponse('Internal Error', { status: 500 })
    }
}
