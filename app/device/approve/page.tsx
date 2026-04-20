"use client"

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { device } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShieldCheck, ShieldX, Monitor, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'approving' | 'denying' | 'approved' | 'denied'

function DeviceApprovalContent() {
    const searchParams = useSearchParams()
    const rawCode = searchParams.get("user_code") ?? ''
    // Display with dash: ABCD1234 → ABCD-1234
    const displayCode = rawCode.length >= 4
        ? `${rawCode.slice(0, 4)}-${rawCode.slice(4)}`
        : rawCode

    const [status, setStatus] = useState<Status>('idle')

    const handleApprove = async () => {
        setStatus('approving')
        try {
            await device.approve({ userCode: rawCode })
            setStatus('approved')
            setTimeout(() => { window.location.href = '/' }, 2000)
        } catch {
            setStatus('idle')
        }
    }

    const handleDeny = async () => {
        setStatus('denying')
        try {
            await device.deny({ userCode: rawCode })
            setStatus('denied')
            setTimeout(() => { window.location.href = '/' }, 2000)
        } catch {
            setStatus('idle')
        }
    }

    const isProcessing = status === 'approving' || status === 'denying'

    if (status === 'approved') {
        return <ResultScreen
            icon={<CheckCircle2 className="w-10 h-10 text-emerald-400" />}
            glow="bg-emerald-500/10"
            title="Device Approved"
            message="The device now has access to your account. Redirecting you home…"
        />
    }

    if (status === 'denied') {
        return <ResultScreen
            icon={<XCircle className="w-10 h-10 text-red-400" />}
            glow="bg-red-500/10"
            title="Access Denied"
            message="The device has been blocked. Redirecting you home…"
        />
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/8 rounded-full blur-[140px]" />
            </div>

            <Card className="relative w-full max-w-md bg-[#111118] border border-white/[0.08] shadow-2xl shadow-black/60">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-full" />

                <CardHeader className="pb-2 pt-8 px-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-xs text-white/35 font-mono tracking-widest uppercase">
                            Authorization Request
                        </span>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-white tracking-tight">
                        Approve Device Access?
                    </CardTitle>
                    <CardDescription className="text-white/45 text-sm mt-1.5 leading-relaxed">
                        A device is requesting access to your account. Only approve if you initiated this request.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8 pt-4 space-y-5">
                    {/* Code badge */}
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-white/35 uppercase tracking-widest font-medium mb-1">
                                Device Code
                            </p>
                            <p className="text-xl font-mono font-semibold text-white tracking-[0.3em]">
                                {displayCode || '—'}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Monitor className="w-4 h-4 text-amber-400/70" />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <Button
                            variant="outline"
                            onClick={handleDeny}
                            disabled={isProcessing}
                            className={cn(
                                "h-11 rounded-xl font-medium text-sm",
                                "bg-red-500/8 border-red-500/25 text-red-400",
                                "hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-300",
                                "disabled:opacity-40 transition-all duration-200"
                            )}
                        >
                            {status === 'denying' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <><ShieldX className="w-4 h-4 mr-1.5" />Deny</>
                            )}
                        </Button>

                        <Button
                            onClick={handleApprove}
                            disabled={isProcessing}
                            className={cn(
                                "h-11 rounded-xl font-medium text-sm",
                                "bg-emerald-600 hover:bg-emerald-500 text-white",
                                "disabled:opacity-40 transition-all duration-200",
                                "shadow-lg shadow-emerald-900/30"
                            )}
                        >
                            {status === 'approving' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <><ShieldCheck className="w-4 h-4 mr-1.5" />Approve</>
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-xs text-white/25">
                        Never approve a device you don't recognise
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

function ResultScreen({ icon, glow, title, message }: {
    icon: React.ReactNode
    glow: string
    title: string
    message: string
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px]", glow)} />
            </div>
            <Card className="relative w-full max-w-sm bg-[#111118] border border-white/[0.08] text-center shadow-2xl shadow-black/60">
                <CardContent className="pt-10 pb-8 px-8 space-y-3">
                    <div className="flex justify-center mb-2">{icon}</div>
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <p className="text-sm text-white/40 leading-relaxed">{message}</p>
                    <div className="pt-2">
                        <Loader2 className="w-4 h-4 text-white/20 animate-spin mx-auto" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function DeviceApprovalPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
        }>
            <DeviceApprovalContent />
        </Suspense>
    )
}
