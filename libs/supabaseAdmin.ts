import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { Price, Product } from "@/types";
import { stripe } from "./stripe";
import { toDateTime } from "./helpers";


// create supabase client
export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// insert product record to database
const upsertProductRecord = async (product: Stripe.Product) => {
    // product data
    const productData: Product = {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description ?? undefined,
        image: product.images?.[0] ?? null,
        metadata: product.metadata
    }

    // up insert to supabase
    const { error } = await supabaseAdmin.from('products').upsert([productData])

    // if there's any error
    if(error) throw error

    // console log successful msg
    console.log(`Product inserted/updated: ${product.id}`)
}

// insert price record to database
const upsertPriceRecord = async (price: Stripe.Price) => {
    // price data
    const priceData: Price = {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : '',
        active: price.active,
        currency: price.currency,
        description: price.nickname ?? undefined,
        type: price.type,
        unit_amount: price.unit_amount ?? undefined,
        interval: price.recurring?.interval,
        interval_count: price.recurring?.interval_count,
        trial_period_days: price.recurring?.trial_period_days,
        metadata: price.metadata
    }

    // up insert to supabase
    const { error } = await supabaseAdmin.from('prices').upsert([priceData])

    // if there's any error
    if(error) throw error

    // console log successful msg
    console.log(`Price inserted/updated: ${price.id}`)
}

// create or retrieve customer
const createOrRetrieveCustomer = async({ email, uuid }: {
    email: string, uuid: string
}) => {
    // get data and error from db
    const { data, error } = await supabaseAdmin.from('customers').select(
        'stripe_customer_id'
    ).eq('id', uuid).single()

    // if any error or not customer data
    // create one
    if(error || !data?.stripe_customer_id) {
        // create customer data
        const customerData: {
            metadata: { supabaseUUID: string },
            email?: string
        } = {
            metadata: {
                supabaseUUID: uuid
            }
        }

        // if email, insert it to customer data
        if(email) customerData.email = email

        // create customer on stripe and supabase
        const customer = await stripe.customers.create(customerData)
        const { error: supabaseError } = await supabaseAdmin.from('customers').insert([{
            id: uuid, stripe_customer_id: customer.id
        }])

        // check for errors
        if(supabaseError) throw supabaseError

        // console log successful msg
        console.log(`New customer created and inserted fro ${uuid}`)

        return customer.id
    }

    // if exists customer
    return data.stripe_customer_id
}

// billing details customer
const copyBillingDetailsToCustomer = async (
    uuid: string, payment_method: Stripe.PaymentMethod
) => {
    // get customer 
    const customer = payment_method.customer as string
    // get name, phone and address
    const { name, phone, address } = payment_method.billing_details

    // check if no name, phone or address
    if(!name || !phone || !address) return

    // upadate customer on stripe and supabse
    // @ts-ignore
    await stripe.customers.update(customer, { name, phone, address })
    const { error } = await supabaseAdmin.from('users').update({
        billing_address: { ...address },
        payment_method: { ...payment_method[payment_method.type] }
    }).eq('id', uuid)

    // if there's any error
    if(error) throw error
}

// manage subscription status
const manageSubscriptionStatusChange = async (
    subscriptionId: string,
    customerId: string,
    createAction = false
) => {
    // get customer data
    const { data: customerData, error: customerError } = await supabaseAdmin.from(
        'customers'
    ).select('id').eq('stripe_customer_id', customerId).single()

    // if any error
    if(customerError) throw customerError

    // get id from customer data
    const { id: uuid } = customerData!

    // retrieve subscription from stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method']
    })

    // create subscription data
    const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
        id: subscription.id,
        user_id: uuid,
        metadata: subscription.metadata,
        // @ts-ignore
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        // @ts-ignore
        quantity: subscription.quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
        canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
        current_period_start: toDateTime(subscription.current_period_start).toISOString(),
        current_period_end: toDateTime(subscription.current_period_end).toISOString(),
        created: toDateTime(subscription.created).toISOString(),
        ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
        trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
        trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toDateString() : null,
    }

    // insert to supabase
    const { error } = await supabaseAdmin.from('subscriptions'). upsert([
        subscriptionData
    ])

    // if there's any error
    if(error) throw error

    // console log successful msg
    console.log(`Inserted / updated subscription [${subscription.id} for ${uuid}]`)

    // if createAction, subscription.default_payment_method and uuid
    if(createAction && subscription.default_payment_method && uuid) {
        // call copyBillingDetailsToCustomer handler
        await copyBillingDetailsToCustomer(
            uuid, subscription.default_payment_method as Stripe.PaymentMethod
        )
    }
}

export {
    upsertProductRecord, upsertPriceRecord,
    createOrRetrieveCustomer, manageSubscriptionStatusChange
}
