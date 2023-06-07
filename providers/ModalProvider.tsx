'use client'

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";
import { useEffect, useState } from "react";


interface ModalProviderProps {
    products: ProductWithPrice[]
}

// modal provider
const ModalProvider: React.FC<ModalProviderProps> = ({
    products
}) => {
    // mount state
    const [isMounted, setIsMounted] = useState(false)

    // change isMounted to true on client side
    useEffect(() => setIsMounted(true), [])

    // if isMounted is false 
    // for server side
    if(!isMounted) return null

    // render elements
    return (
        <>
            <AuthModal />
            <UploadModal />
            <SubscribeModal products={products} />
        </>
    );
}
 
export default ModalProvider;
