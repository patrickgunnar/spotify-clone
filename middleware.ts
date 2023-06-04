import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest, NextResponse } from "next/server"


export async function middleware(req: NextRequest) {
    // next response
    const res = NextResponse.next()
    // middleware client
    const supabase = createMiddlewareClient({
        req, res
    })

    // get supabase session
    await supabase.auth.getSession()
    
    // return response
    return res
}
