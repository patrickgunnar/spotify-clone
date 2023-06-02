'use client'

import { Database } from "@/types_db";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react";


interface SupabaseProviderProps {
    children: React.ReactNode
}

// supabase provider
const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children
}) => {
    // supabase state
    const [supabaseClient] = useState(
        () => createClientComponentClient<Database>()
    )

    // session provider
    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    );
}
 
export default SupabaseProvider;
