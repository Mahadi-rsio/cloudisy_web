import type { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Cloudisy — Simple Hosting Platform for Developers in Bangladesh",
        template: "%s | Cloudisy"
    },

    description:
        "Cloudisy is a modern hosting platform for developers and startups in Bangladesh. Deploy static sites and Next.js apps with auto scaling, Git integration, and CI/CD. Pay easily with bKash, Nagad, or Upay.",

    keywords: [
        "cloudisy",
        "hosting bangladesh",
        "nextjs hosting",
        "static hosting",
        "bangladesh hosting platform",
        "vercel alternative bangladesh",
        "deploy nextjs bangladesh",
        "student hosting platform",
        "startup hosting bangladesh",
        "cheap hosting bangladesh",
        "auto deploy hosting",
        "git deployment hosting",
        "ci cd hosting",
        "developer hosting bangladesh",
        "bkash hosting",
        "nagad hosting",
        "upay hosting",
        "cloud hosting bangladesh",
        "frontend hosting",
        "jamstack hosting",
        "nextjs deploy platform",
        "fast hosting bangladesh",
        "developer tools bangladesh",
        "startup tools bangladesh",
        "deploy website easily",
        "bangladesh developer platform",
        "cloudisy hosting",
        "serverless hosting",
        "modern hosting platform",
        "student developer hosting",
        "react hosting",
        "spa hosting",
        "nuxt hosting",
        "anguler hosting",
        "vue hosting",
        "svelte hosting",
        "mern statck hosting",
        "pay as you go hosting bangladesh"
    ],

    authors: [{ name: "Cloudisy Team" }],
    creator: "Cloudisy",

    openGraph: {
        title: "Cloudisy — Modern Hosting Platform",
        description:
            "Deploy static sites and Next.js apps instantly. Built for developers, students, and startups in Bangladesh.",
        url: "https://cloudisy.top",
        siteName: "Cloudisy",
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Cloudisy Hosting Platform",
        description:
            "Deploy static and Next.js apps instantly. Hosting built for developers in Bangladesh.",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    icons: {
        icon: "/logo.png",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>{children}</>
    )
}
