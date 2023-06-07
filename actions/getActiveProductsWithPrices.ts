import { ProductWithPrice } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
    // supabase server component client
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    // fetch products
    const { data, error } = await supabase.from('products').select('*, prices(*)').eq(
        'active', true
    ).eq('prices.active', true).order('metadata->index').order(
        'unit_amount', { foreignTable: 'prices' }
    )

    // if error
    if(error) console.log(error)

    return (data as any) || []
}

export default getActiveProductsWithPrices

