'use client'

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";
import Input from "./Input";


const SearchInput = () => {
    // get router
    const router = useRouter()
    // value state
    const [value, setValue] = useState<string>('')
    // debounce hook
    const debounceValue = useDebounce<string>(value, 500)

    //
    useEffect(() => {
        // create query
        const query = {
            title: debounceValue
        }

        // create an url
        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        })

        // push router
        router.push(url)
    }, [debounceValue, router])

    // render elements
    return (
        <Input
            placeholder="What do you want to listen to?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
 
export default SearchInput;
