import { Price } from "@/types";


// get url
export const getURL = () => {
    // public url, site, vercel and local host
    let url = (
        process.env.NEXT_PUBLIC_SITE_URL ?? 
        process.env.NEXT_PUBLIC_VERCEL_URL ?? 
        'http://localhost:3000/'
    )

    // check if url includes http
    // else add https
    url = url.includes('http') ? url : `https://${url}`
    // check if the last char in url is '/'
    // else add '/' to the end of url
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

    return url
}

// post data
export const postData = async ({ url, data }: {
    url: string, data?: { price: Price }
}) => {
    // console post request
    console.log('POST REQUEST', url, data)

    // fetch data
    const res: Response = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(data)
    })

    // res is not ok
    if(!res.ok) {
        // console log error
        console.log('Error in POST', { url, data, res })

        throw new Error(res.statusText)
    }

    return res.json()
}

// to date time
export const toDateTime = (secs: number) => {
    // unix time
    var time = new Date('1970-01-01T00:30:00Z')
    // set seconds
    time.setSeconds(secs)

    return time
}
