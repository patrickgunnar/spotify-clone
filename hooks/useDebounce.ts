import { useEffect, useState } from "react";


function useDebounce<T>(value: T, delay?: number): T {
    // debounce state
    const [debounceValue, setDebounceValue] = useState<T>(value)

    // set time out
    useEffect(() => {
        // time out function
        const timer = setTimeout(() => {
            // set value
            setDebounceValue(value)
        }, delay || 500)

        // on unmount
        return () => clearTimeout(timer)
    }, [value, delay])

    // return value
    return debounceValue
}

export default useDebounce
