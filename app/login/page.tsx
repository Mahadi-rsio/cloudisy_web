"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { getSession, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";









interface ParticleProps {
    x: number
    y: number
    size: number
    color: string
    duration: number
    delay: number
}

interface GlowButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "primary";
    className?: string;
}

interface FloatingBadgeProps {
    children: React.ReactNode;
    delay: number;
    x: string;
    y: string;
}

interface Provider {
    id: string;
    label: string;
    icon: React.ReactNode;
}




const Particle = ({ x, y, size, color, duration, delay }: ParticleProps) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            background: color,
            filter: "blur(1px)"
        }}
        animate={{ y: [0, -30, 0], opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
);


// ── Glow Button ───────────────────────────────────────────────────────────────
const GlowButton = ({ children, onClick, variant = "default", className = "" }: GlowButtonProps) => {
    const [hovered, setHovered] = useState<boolean>(false);

    const variantClasses: Record<"default" | "primary", string> = {
        default: "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40",
        primary: "bg-violet-600/80 border-violet-400/50 hover:bg-violet-500/90 hover:border-violet-300/70",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.018, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={onClick}
            className={`relative w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 overflow-hidden ${variantClasses[variant]} ${className}`}
        >
            {hovered && (
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.15), transparent 70%)" }}
                />
            )}
            {children}
        </motion.button>
    );
};

// ── Logo ──────────────────────────────────────────────────────────────────────
const Logo = () => (
    <motion.div className="flex items-center gap-2.5" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="relative">
            <img src='/logo.png' className="h-14" />
        </div>
    </motion.div>
);

// ── Provider Icons ─────────────────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
        <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
);

const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
);

const DiscordIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const PasskeyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <path d="M16 11l1.5 1.5L20 10" />
    </svg>
);

// ── Floating Badge ─────────────────────────────────────────────────────────────
const FloatingBadge = ({ children, delay, x, y }: FloatingBadgeProps) => (
    <motion.div
        className="absolute hidden lg:flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5 text-xs text-white/70 font-medium"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ delay, duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    >
        {children}
    </motion.div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function App() {
    const [agreed, setAgreed] = useState<boolean>(false);
    const [activeProvider, setActiveProvider] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successProvider, setSuccessProvider] = useState<string | null>(null);
    const [particles, setParticles] = useState<ParticleProps[]>([])

    const mouseX = useMotionValue<number>(0);
    const mouseY = useMotionValue<number>(0);
    const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

    const glowX = useTransform(springX, [0, 1], ["-30%", "80%"]);
    const glowY = useTransform(springY, [0, 1], ["-30%", "80%"]);
    const router = useRouter()

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    async function validateSession() {
        const { data, error } = await getSession()

        if (error) {
            return
        }

        if (data) {
            toast.info("You Are Already Logged In.Redirecting...")
            //router.push('/dashboard')
        }
    }

    const Providers = ["github", "google", "passkey"] as const;
    type ProviderType = typeof Providers[number]

    const handleLogin = async (provider: ProviderType) => {

        if (!agreed) return

        setActiveProvider(provider)
        setLoading(true)

        if (provider != 'passkey') {
            const { data, error } = await signIn.social({
                provider: provider
            })

            if (error) {
                setLoading(false)
                toast.error("Login failed " + error.message)
            }

            if (data) {
                setLoading(false)
                toast.info("Successfully Authenticated. Redirecting...")
                router.push('/dashboard')
            }
        }

        if (provider === "passkey") {
            try {
                const { data, error } = await signIn.passkey()

                if (error) {
                    toast.error("No passkey found. Please sign in first and register a passkey.")
                    setLoading(false)
                    return
                }

                if (data) {
                    toast.success("Authenticated with passkey!")
                    router.push("/dashboard")
                }

            } catch (err: any) {
                if (err.name === "AbortError") {
                    toast.info("No passkey available for this device.")
                } else {
                    toast.error("Passkey authentication failed.")
                }

                setLoading(false)
            }
        }
    };



    const providers: Provider[] = [
        { id: "google", label: "Continue with Google", icon: <GoogleIcon /> },
        { id: "github", label: "Continue with GitHub", icon: <GithubIcon /> },
        { id: "passkey", label: "Use a Passkey", icon: <PasskeyIcon /> },
    ];

    useEffect(() => {
        const generated: ParticleProps[] = Array.from({ length: 18 }, (_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            color: [
                "rgba(139,92,246,0.6)",
                "rgba(59,130,246,0.5)",
                "rgba(167,139,250,0.4)",
                "rgba(56,189,248,0.5)"
            ][i % 4],
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 3
        }))

        setParticles(generated)
    }, [])

    useEffect(() => {
        validateSession()
    }, [])

    const footerLinks: string[] = ["Privacy", "Security", "Help"];

    return (
        
            <div
                className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0a0612 0%, #0d1117 50%, #050b18 100%)", fontFamily: "'DM Sans', sans-serif" }}
                onMouseMove={handleMouseMove}
            >
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes borderGlow {
          0%,100%{box-shadow:0 0 15px rgba(124,58,237,0.4),inset 0 0 15px rgba(124,58,237,0.05)}
          50%{box-shadow:0 0 30px rgba(37,99,235,0.5),inset 0 0 20px rgba(37,99,235,0.08)}
        }
        .card-glow { animation: borderGlow 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #e2e8f0 0%, #a78bfa 30%, #38bdf8 50%, #a78bfa 70%, #e2e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

                {/* Mouse-following glow */}
                <motion.div
                    className="fixed pointer-events-none"
                    style={{
                        width: 600, height: 600, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
                        x: glowX, y: glowY, zIndex: 0,
                    }}
                />

                {/* Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {particles.map((p, i) => <Particle key={i} {...p} />)}
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />

                {/* Scanline */}
                <motion.div
                    className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)", zIndex: 1 }}
                    animate={{ y: ["-10vh", "110vh"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
                />

                {/* Ambient blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

                {/* Floating badges */}
                <FloatingBadge delay={0.5} x="8%" y="20%"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> 98% uptime SLA</FloatingBadge>
                <FloatingBadge delay={1.2} x="75%" y="15%">🔒 SOC 2 Certified</FloatingBadge>
                <FloatingBadge delay={0.8} x="80%" y="70%">⚡ 12ms avg latency</FloatingBadge>
                <FloatingBadge delay={1.5} x="5%" y="72%">🌍 Global CDN</FloatingBadge>

                {/* Card */}
                <motion.div
                    className="relative z-10 w-full max-w-md mx-4"
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Animated border wrapper */}
                    <div className="relative rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(37,99,235,0.4), rgba(56,189,248,0.3), rgba(124,58,237,0.6))" }}>
                        <div
                            className="relative rounded-2xl p-8 card-glow"
                            style={{ background: "linear-gradient(145deg, rgba(15,10,30,0.97) 0%, rgba(10,15,25,0.98) 100%)", backdropFilter: "blur(20px)" }}
                        >
                            {/* Top bar */}
                            <div className="flex items-center justify-between mb-8">
                                <Logo />
                                <motion.div
                                    className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                    Secure
                                </motion.div>
                            </div>

                            {/* Headline */}
                            <div className="mb-8 text-center">
                                <motion.h1
                                    className="text-3xl font-bold mb-2 shimmer-text"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Welcome back
                                </motion.h1>
                                <motion.p
                                    className="text-sm text-white/45"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    Sign in to your workspace — no password required
                                </motion.p>
                            </div>

                            {/* Webauthin */}
                            <input
                                type="text"
                                autoComplete="username webauthn"
                                className="hidden"
                            />

                            {/* Providers */}
                            <div className="space-y-3">
                                {providers.map((p: Provider, i: number) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.08 }}
                                    >
                                        <div className="relative">
                                            <GlowButton

                                                onClick={() => handleLogin(p.id as ProviderType)}
                                                variant={p.id === "passkey" ? "primary" : "default"}
                                                className={!agreed ? "opacity-50 cursor-not-allowed" : ""}
                                            >
                                                <span className="flex-shrink-0">{p.icon}</span>
                                                <span>{p.label}</span>
                                                <AnimatePresence>
                                                    {activeProvider === p.id && loading && (
                                                        <motion.span
                                                            className="absolute right-4"
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0 }}
                                                        >
                                                            <motion.div
                                                                className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                            />
                                                        </motion.span>
                                                    )}
                                                    {successProvider === p.id && (
                                                        <motion.span
                                                            className="absolute right-4 text-emerald-400 text-base"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            ✓
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </GlowButton>

                                            {p.id === "passkey" && (
                                                <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
                                                    background: "radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 70%)",
                                                    filter: "blur(8px)",
                                                    zIndex: -1,
                                                }} />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Divider */}
                            <motion.div
                                className="flex items-center gap-3 my-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.75 }}
                            >
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-xs text-white/30 font-medium">Protected by NexusAI</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </motion.div>

                            {/* Terms checkbox */}
                            <motion.div
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.85 }}
                            >
                                <button
                                    onClick={() => setAgreed((prev: boolean) => !prev)}
                                    className="relative flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border transition-all duration-200"
                                    style={{
                                        borderColor: agreed ? "rgba(124,58,237,0.8)" : "rgba(255,255,255,0.2)",
                                        background: agreed ? "rgba(124,58,237,0.25)" : "transparent",
                                        boxShadow: agreed ? "0 0 10px rgba(124,58,237,0.4)" : "none",
                                    }}
                                >
                                    <AnimatePresence>
                                        {agreed && (
                                            <motion.svg
                                                className="absolute inset-0 m-auto"
                                                width="12" height="12" viewBox="0 0 12 12"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <motion.path
                                                    d="M2 6L5 9L10 3"
                                                    stroke="rgba(167,139,250,1)"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    fill="none"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.25 }}
                                                />
                                            </motion.svg>
                                        )}
                                    </AnimatePresence>
                                </button>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    I agree to the{" "}
                                    <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2">Terms of Service</a>
                                    {" "}and{" "}
                                    <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2">Privacy Policy</a>
                                    . I understand my data is processed securely.
                                </p>
                            </motion.div>

                            {/* Warning */}
                            <AnimatePresence>
                                {!agreed && (
                                    <motion.p
                                        className="text-xs text-amber-400/60 mt-2 ml-8"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        ↑ Accept terms to continue
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Footer links */}
                            <motion.div
                                className="mt-6 flex items-center justify-center gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                {footerLinks.map((item: string) => (
                                    <a key={item} href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        
    );
}

