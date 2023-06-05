'use client'

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import {  BiSearch } from "react-icons/bi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";


interface SidebarProps {
    songs: Song[]
    children: React.ReactNode
}

// sidebar 
const Sidebar: React.FC<SidebarProps> = ({
    songs, children
}) => {
    // pathname hook
    const pathname = usePathname()
    // player hook
    const player = usePlayer()

    // array of possible routes
    const routes = useMemo(() => [
        {
            icon: HiHome,
            label: 'Home',
            active: pathname !== '/search',
            href: '/'
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname === '/search',
            href: '/search'
        }
    ], [pathname])

    // render elements
    return (
        <div className={twMerge("flex h-full", player.activeId && "h-[calc(100%-80px)]")}>
            <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
                <Box>
                    <div className="flex flex-col gap-y-4 px-5 py-4">
                        {
                            routes.map(item => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                />
                            ))
                        }
                    </div>
                </Box>
                <Box className="overflow-y-auto h-full">
                    <Library songs={songs} />
                </Box>
            </div>
            <main className="h-full flex-1 overflow-y-auto py-2">
                {children}
            </main>
        </div>
    );
}
 
export default Sidebar;
