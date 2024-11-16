import React from 'react'
import { createPublicClient, http, Chain } from 'viem'

export default function getPublicClient(chain: Chain) {
    const publicClient = createPublicClient({
        chain: chain,
        transport: http()
    })

    return publicClient
}
