import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from "@/context/Web3ModalProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    metadataBase: new URL('https://bodint.tech'),
    title: {
        default: "HEDGEHOGS | Supporting Wildlife Rescue",
        template: "%s | HEDGEHOGS"
    },
    description: "Support hedgehog rescue through on-chain contributions. Let Shelter Guide AI monitor habitats and secure rewards for conservation efforts.",
    keywords: ["Conservation", "Hedgehog Rescue", "Charity", "Web3", "Shelter Guide", "EVM", "The Hedgehogs Project"],
    authors: [{ name: "The Hedgehogs Project Team" }],
    icons: {
        icon: "/images/hedgehog_mascot.png",
        shortcut: "/images/hedgehog_mascot.png",
        apple: "/images/hedgehog_mascot.png",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://bodint.tech",
        title: "HEDGEHOGS | Supporting Wildlife Rescue",
        description: "Support hedgehog rescue through on-chain contributions. Join the mission.",
        siteName: "The Hedgehogs Project",
        images: [
            {
                url: "/images/hedgehog_mascot.png",
                width: 1200,
                height: 630,
                alt: "The Hedgehogs Project Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "HEDGEHOGS | Supporting Wildlife Rescue",
        description: "Support hedgehog rescue through on-chain contributions. Join the mission.",
        images: ["/images/hedgehog_mascot.png"],
    },
    robots: {
        index: true,
        follow: true,
    }
};

import Analytics from "@/components/Analytics";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white px-0 overflow-x-hidden relative`}>
                <div className="emerald-overlay" />
                <div className="grid-background" />
                <Analytics />
                <Web3ModalProvider>{children}</Web3ModalProvider>
            </body>
        </html>
    );
}
