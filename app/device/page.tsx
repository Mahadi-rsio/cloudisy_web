'use client'

import { useState } from 'react'
import { device } from '@/lib/auth-client'

export default function DeviceAuthorizationPage() {
    const [userCode, setUserCode] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            // Format the code: remove dashes and convert to uppercase
            const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

            // Check if the code is valid using GET /device endpoint
            const response = await device({
                query: { user_code: formattedCode },
            });

            if (response.data) {
                // Redirect to approval page
                window.location.href = `/device/approve?user_code=${formattedCode}`;
            }
        } catch (err) {
            alert(err)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Enter device code (e.g., ABCD-1234)"
                maxLength={12}
            />
            <button type="submit">Continue</button>
        </form>
    );
}
