import { createAuthClient } from "better-auth/react"
import { passkeyClient } from '@better-auth/passkey/client'
import { jwtClient, deviceAuthorizationClient } from 'better-auth/client/plugins'

export const {
    getSession,
    signIn,
    signOut,
    token,
    refreshToken,
    device

} = createAuthClient({
    plugins: [
        passkeyClient(),
        jwtClient(),
        deviceAuthorizationClient()
    ]
})
