'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";


interface ListItemProps {
    image: string
    name: string
    href: string
}

// list item
const ListItem: React.FC<ListItemProps> = ({
    image, name, href
}) => {
    // get router
    const router = useRouter()

    // handle on click - routes to href
    // authenticate before push
    const onClick = () => {
        router.push(href)
    }

    // render elements
    return (
        <button className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4"
            type="button" onClick={onClick}
        >
            <div className="relative min-h-[64px] min-w-[64px]">
                <Image className="object-cover"
                    fill
                    src={image}
                    alt="Image"
                />
            </div>
            <p className="font-medium truncate py-5">
                {name}
            </p>
            <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-110">
                <FaPlay className="text-black" />
            </div>
        </button>
    );
}
 
export default ListItem;
