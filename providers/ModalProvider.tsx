'use client'

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import { useEffect, useState } from "react";


// modal provider
const ModalProvider = () => {
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
        </>
    );
}
 
export default ModalProvider;
