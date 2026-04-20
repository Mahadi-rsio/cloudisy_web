'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { device } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Monitor, ArrowRight, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

function DeviceAuthContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [userCode, setUserCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const codeFromParams = searchParams.get('user_code') || searchParams.get('code')
        if (codeFromParams) {
            // Format with dash for display: ABCD1234 → ABCD-1234
            const clean = codeFromParams.replace(/-/g, '').toUpperCase()
            const formatted = clean.length >= 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean
            setUserCode(formatted)
        }
    }, [searchParams])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)
        if (val.length > 4) val = `${val.slice(0, 4)}-${val.slice(4)}`
        setUserCode(val)
        setError('')
    }

    const handleSubmit = async () => {
        const formattedCode = userCode.trim().replace(/-/g, '').toUpperCase()
        if (formattedCode.length < 8) {
            setError('Please enter a valid 8-character code.')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const response = await device({ query: { user_code: formattedCode } })
            if (response.data) {
                router.push(`/device/approve?user_code=${formattedCode}`)
            } else {
                setError('Invalid or expired code. Please try again.')
            }
        } catch {
            setError('Could not verify code. Check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
            </div>

            <Card className="relative w-full max-w-md bg-[#111118] border border-white/[0.08] shadow-2xl shadow-black/60">
                {/* Top accent line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent rounded-full" />

                <CardHeader className="pb-2 pt-8 px-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-violet-400" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/35 font-mono tracking-widest uppercase">
                            <Shield className="w-3 h-3" />
                            Secure Authorization
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-white tracking-tight">
                        Connect a Device
                    </CardTitle>
                    <CardDescription className="text-white/45 text-sm mt-1.5 leading-relaxed">
                        Enter the code displayed on the device you want to authorize.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8 pt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white/50 tracking-wider uppercase">
                            Device Code
                        </label>
                        <Input
                            value={userCode}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="XXXX-XXXX"
                            maxLength={9}
                            autoFocus
                            className={cn(
                                "h-12 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/20",
                                "text-center text-xl font-mono tracking-[0.35em] rounded-xl",
                                "focus-visible:ring-1 focus-visible:ring-violet-500/60 focus-visible:border-violet-500/40",
                                "transition-all duration-200",
                                error && "border-red-500/50 focus-visible:ring-red-500/40"
                            )}
                        />
                        {error && (
                            <p className="text-xs text-red-400/80 pt-0.5">{error}</p>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || userCode.replace(/-/g, '').length < 8}
                        className={cn(
                            "w-full h-11 rounded-xl font-medium text-sm tracking-wide",
                            "bg-violet-600 hover:bg-violet-500 text-white",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                            "transition-all duration-200 shadow-lg shadow-violet-900/40"
                        )}
                    >
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</>
                        ) : (
                            <><span>Continue</span><ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>

                    <p className="text-center text-xs text-white/25 pt-1">
                        Only authorize devices you own or trust
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default function DeviceAuthorizationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
        }>
            <DeviceAuthContent />
        </Suspense>
    )
}
