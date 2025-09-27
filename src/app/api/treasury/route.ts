import { NextResponse } from 'next/server'
import { createPublicClient, http, getContract, formatUnits } from 'viem'
import { base } from 'viem/chains'

/**
 * ENV REQUIRED:
 *  BASE_RPC_URL            -> e.g. https://base-mainnet.g.alchemy.com/v2/XXXX
 *  TREASURY_ADDRESS        -> your treasury wallet address (checksummed or lowercased)
 *
 * OPTIONAL (for stablecoins priced 1:1 USD):
 *  STABLE_TOKENS_JSON      -> JSON array of { address, decimals, symbol } on Base
 *                              e.g. [{"address":"0xA0b...","decimals":6,"symbol":"USDC"}]
 *
 * OPTIONAL (price ETH using Chainlink; otherwise ETH not counted in USD):
 *  ETH_USD_FEED_ADDRESS    -> Chainlink ETH/USD proxy on Base
 *
 * OPTIONAL quick override
 *  TREASURY_USD_OVERRIDE   -> number to short-circuit for testing
 */

const RPC  = process.env.BASE_RPC_URL!
const WHO  = (process.env.TREASURY_ADDRESS || '').toLowerCase()

type Stable = { address: string; decimals: number; symbol?: string }
const STABLES: Stable[] = (() => {
  try {
    const raw = process.env.STABLE_TOKENS_JSON
    if (!raw) return []
    const parsed = JSON.parse(raw) as Stable[]
    return parsed.map(s => ({ ...s, address: s.address.toLowerCase() }))
  } catch {
    return []
  }
})()

// Minimal ERC20 ABI
const erc20 = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'a', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
]

// Chainlink aggregator ABI (roundData answer is 8 decimals typically)
const aggregatorV3 = [
  { type: 'function', name: 'latestRoundData', stateMutability: 'view', inputs: [], outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer',  type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' },
  ] }
]

export async function GET() {
  // quick override for demos
  if (process.env.TREASURY_USD_OVERRIDE) {
    return NextResponse.json({ treasuryUsd: Number(process.env.TREASURY_USD_OVERRIDE) })
  }

  try {
    if (!RPC || !WHO) {
      return NextResponse.json({ treasuryUsd: 0, error: 'Missing env: BASE_RPC_URL / TREASURY_ADDRESS' }, { status: 500 })
    }

    const client = createPublicClient({ chain: base, transport: http(RPC) })

    // 1) ETH balance (optional priced via Chainlink)
    let ethUsd = 0
    const ethBal = await client.getBalance({ address: `0x${WHO.replace(/^0x/, '')}` as `0x${string}` })
    if (ethBal > 0n && process.env.ETH_USD_FEED_ADDRESS) {
      const feed = getContract({
        address: process.env.ETH_USD_FEED_ADDRESS as `0x${string}`,
        abi: aggregatorV3,
        client,
      })
      const [, answer] = await feed.read.latestRoundData()
      // Chainlink ETH/USD answers typically 8 decimals
      const ethPrice = Number(answer) / 1e8
      const eth = Number(formatUnits(ethBal, 18))
      ethUsd = eth * ethPrice
    }

    // 2) Stablecoins (1:1 USD)
    let stableUsd = 0
    for (const s of STABLES) {
      const token = getContract({
        address: s.address as `0x${string}`,
        abi: erc20,
        client,
      })
      const raw = await token.read.balanceOf([`0x${WHO.replace(/^0x/, '')}` as `0x${string}`]) as bigint
      const dec = s.decimals ?? 6
      const amt = Number(formatUnits(raw, dec))
      stableUsd += amt
    }

    const treasuryUsd = Math.round(ethUsd + stableUsd)
    return NextResponse.json({ treasuryUsd, breakdown: { ethUsd: Math.round(ethUsd), stableUsd: Math.round(stableUsd) } })
  } catch (e) {
    return NextResponse.json({ treasuryUsd: 0, error: String(e) }, { status: 500 })
  }
}
