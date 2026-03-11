"use client"

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Cloudisy – Developer Cloud Bangladesh",
    description:
        "Securely sign in to your Cloudisy account. Manage your Next.js apps, static sites, and view your deployment history",
    keywords: [
        "cloudisy login",
        "cloudisy account",
        "developer dashboard login",
        "hosting login bangladesh",
        "nextjs hosting"
    ],
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}

