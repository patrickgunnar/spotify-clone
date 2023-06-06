import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/libs/stripe";
import {
    upsertProductRecord, upsertPriceRecord, manageSubscriptionStatusChange
} from "@/libs/supabaseAdmin";


// relevant events
const relevantEvents = new Set([
    'product.created', 'product.updated',
    'price.created', 'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
])

export async function POST(request: Request) {
    // get body
    const body = await request.text()
    // get signature
    const sig = headers().get('Stripe-Signature')

    // webhook secret
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    // event variable
    let event: Stripe.Event

    try {
        // if not sig or webhook secret
        if(!sig || !webhookSecret) return

        // create an event
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (error: any) {
        console.log(`Error message: ${error.message}`)

        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    // if relevant events has event
    // go through switch cases
    if(relevantEvents.has(event.type)) {
        try {
            switch(event.type) {
                case 'product.created':
                case 'product.updated':
                    // call upsertProductRecord function
                    // passing the event data obj 
                    await upsertProductRecord(event.data.object as Stripe.Product)
                    break
                case 'price.created':
                case 'price.updated':
                    // call upsertPriceRecord function
                    // passing the event data obj 
                    await upsertPriceRecord(event.data.object as Stripe.Price)
                    break
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription

                    // call manageSubscriptionStatusChange function
                    // passing subscription
                    await manageSubscriptionStatusChange(
                        subscription.id, subscription.customer as string,
                        event.type === 'customer.subscription.created'
                    )
                    break
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session

                    // if checkout mode is subscription
                    if(checkoutSession.mode === 'subscription') {
                        // get subscription id
                        const subscriptionId = checkoutSession.subscription

                        // call manageSubscriptionStatusChange function
                        // passing subscriptionId, checkoutSession.customer and true
                        await manageSubscriptionStatusChange(
                            subscriptionId as string,
                            checkoutSession.customer as string,
                            true
                        )
                    }

                    break
                default:
                    throw new Error('Unhandled relevant event!')
            }
        } catch (error) {
            console.log(error)

            // return next response error
            return new NextResponse('Webhook error', { status: 400 })
        }
    }

    // return next response
    return NextResponse.json({ received: true }, { status: 200 })
}
