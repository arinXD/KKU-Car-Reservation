"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import NavbarComponent from "@/components/Navbar";
import ContentBox from "@/components/ContentBox";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    const url = usePathname();
    return (
        <html lang="en">
            <body suppressHydrationWarning={true} className={inter.className}>
                <Provider>
                    {!url.includes("/auth") && <NavbarComponent />}
                    <ContentBox>{children}</ContentBox>
                </Provider>
            </body>
        </html>
    );
}
