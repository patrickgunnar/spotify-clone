import { loadStripe, Stripe } from "@stripe/stripe-js";


// stripe promise
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
    // if not stripe promise
    // load stripe
    if(!stripePromise) stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
    )

    return stripePromise
}
