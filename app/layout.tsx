import "./globals.css";
import { Figtree } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import Player from "@/components/Player";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";


const figtree = Figtree({ subsets: ["latin"] });

export const metadata = {
    title: "Spotify Clone",
    description: "Listen to music!",
};

export const revalidate = 0

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // get user songs
    const userSongs = await getSongsByUserId()
    // get products with prices
    const products = await getActiveProductsWithPrices()

    // render layout
    return (
        <html lang="en">
            <body className={figtree.className}>
                <ToasterProvider />
                <SupabaseProvider>
                    <UserProvider>
                        <ModalProvider products={products} />
                        <Sidebar songs={userSongs}>
                            {children}
                        </Sidebar>
                        <Player />
                    </UserProvider>
                </SupabaseProvider>
			</body>
        </html>
    );
}
