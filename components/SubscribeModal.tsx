'use client'

import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import useSubscribeModal from "@/hooks/useSubscribeModal";


interface SubscribeModalProps {
    products: ProductWithPrice[]
}

// price formatter
const formatPrice = (price: Price) => {
    // price string
    const priceString = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: price.currency,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100)

    return priceString
}

// subscribe modal
const SubscribeModal: React.FC<SubscribeModalProps> = ({
    products
}) => {
    // subscribe modal hook
    const subscribeModal =  useSubscribeModal()
    // get user, loading state and subscription
    const { user, isLoading, subscription } = useUser()

    // price id loading
    const [priceIdLoading, setPriceIdLoading] = useState<string>()

    // on change handler
    const onChange = (open: boolean) => {
        // if not open
        if(!open) subscribeModal.onClose()
    }

    // checkout handler
    const handleCheckout =async (price: Price) => {
        // set price id loading
        setPriceIdLoading(price.id)

        // if not user
        if(!user) {
            // set price id loading
            setPriceIdLoading(undefined)

            return toast.error('Must be logged in')
        }

        // if exists subscription
        if(subscription) {
            // set price id loading
            setPriceIdLoading(undefined)

            return toast('Already subscribe')
        }

        // checkout session
        try {
            // get session id from post data
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            })

            // get stripe
            const stripe = await getStripe()

            // redirect to checkout
            stripe?.redirectToCheckout({ sessionId })
        } catch (error) {
            toast.error((error as Error)?.message)
        } finally {
            // set price id loading
            setPriceIdLoading(undefined)
        }
    }

    // create content
    let content = (
        <div className="text-center">
            No products available.
        </div>
    )

    // if exists products
    if(products.length) content = (
        <div>
            {
                products.map(product => {
                    // if not prices
                    if(!product.prices?.length) return (
                        <div key={product.id}>
                            No prices available
                        </div>
                    )

                    // if exists prices
                    return product.prices.map(price => (
                        <Button key={price.id} className="mb-4"
                            onClick={() => handleCheckout(price)}
                            disabled={isLoading || price.id === priceIdLoading}
                        >
                            {
                                `Subscribe for ${formatPrice(price)} a ${price.interval}`
                            }
                        </Button>
                    ))
                })
            }
        </div>
    )

    console.log(subscription)
    // if exists subscription
    if(subscription) content = (
        <div className="text-center">
            Already subscribed
        </div>
    )

    // render elements
    return (
        <Modal
            title="Only for premium users"
            description="Listen to music with Spotify premium"
            isOpen={subscribeModal.isOpen}
            onChange={onChange}
        >
            {content}
        </Modal>
    );
}
 
export default SubscribeModal;
