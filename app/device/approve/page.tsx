// app/device/approve/page.tsx
"use client"

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react'
import { device } from '@/lib/auth-client'

function DeviceApprovalContent() {
    const searchParams = useSearchParams();
    const userCode = searchParams.get("user_code");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = async () => {
        setIsProcessing(true);
        try {
            await device.approve({ userCode: userCode! });
            alert("Device approved successfully!");
            window.location.href = "/";
        } catch (error) {
            alert("Failed to approve device");
        }
        setIsProcessing(false);
    };

    const handleDeny = async () => {
        setIsProcessing(true);
        try {
            await device.deny({ userCode: userCode! });
            alert("Device denied");
            window.location.href = "/";
        } catch (error) {
            alert("Failed to deny device");
        }
        setIsProcessing(false);
    };

    return (
        <div>
            <h2>Device Authorization Request</h2>
            <p>A device is requesting access to your account.</p>
            <p>Code: {userCode}</p>
            <button onClick={handleApprove} disabled={isProcessing}>Approve</button>
            <button onClick={handleDeny} disabled={isProcessing}>Deny</button>
        </div>
    );
}

export default function DeviceApprovalPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeviceApprovalContent />
        </Suspense>
    );
}
