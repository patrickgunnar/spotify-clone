'use client'

import { Toaster } from "react-hot-toast";


// toaster
const ToasterProvider = () => {

    // render elements
    return (
        <Toaster
            toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff'
                }
            }}
        />
    );
}
 
export default ToasterProvider;
