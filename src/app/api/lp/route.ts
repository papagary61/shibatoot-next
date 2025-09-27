import { NextResponse } from 'next/server'
import { createPublicClient, http, getContract, formatUnits } from 'viem'
import { base } from 'viem/chains'

/**
 * ENV REQUIRED:
 *  BASE_RPC_URL            -> e.g. https://base-mainnet.g.alchemy.com/v2/XXXX
 *  PAIR_ADDRESS            -> UniswapV2/Aerodrome pair address for SHBT/USDC (example)
 *  USD_TOKEN_ADDRESS       -> the stable token in the pair (e.g., USDC)
 *  USD_TOKEN_DECIMALS      -> decimals for that token (6 for USDC)
 *
 * OPTIONAL:
 *  LP_USD_OVERRIDE         -> force a value for testing
 */

const RPC = process.env.BASE_RPC_URL!
const PAIR = (process.env.PAIR_ADDRESS || '').toLowerCase()
const USD  = (process.env.USD_TOKEN_ADDRESS || '').toLowerCase()
const USD_DEC = Number(process.env.USD_TOKEN_DECIMALS ?? 6)

// UniswapV2 Pair ABI (minimal)
const pairAbi = [
  { type: 'function', stateMutability: 'view', name: 'token0', inputs: [], outputs: [{type:'address'}] },
  { type: 'function', stateMutability: 'view', name: 'token1', inputs: [], outputs: [{type:'address'}] },
  { type: 'function', stateMutability: 'view', name: 'getReserves', inputs: [], outputs: [
      {type:'uint112', name:'_reserve0'},
      {type:'uint112', name:'_reserve1'},
      {type:'uint32',  name:'_blockTimestampLast'}
  ]},
]

export async function GET() {
  // quick override for demos
  if (process.env.LP_USD_OVERRIDE) {
    return NextResponse.json({ lpUsd: Number(process.env.LP_USD_OVERRIDE) })
  }

  try {
    if (!RPC || !PAIR || !USD) {
      return NextResponse.json({ lpUsd: 0, error: 'Missing env: BASE_RPC_URL/PAIR_ADDRESS/USD_TOKEN_ADDRESS' }, { status: 500 })
    }

    const client = createPublicClient({ chain: base, transport: http(RPC) })
    const pair = getContract({ address: `0x${PAIR.replace(/^0x/, '')}` as `0x${string}`, abi: pairAbi, client })

    const [token0, token1] = await Promise.all([pair.read.token0(), pair.read.token1()])
    const [r0, r1] = await pair.read.getReserves()

    const t0 = (token0 as string).toLowerCase()
    const t1 = (token1 as string).toLowerCase()

    // find which reserve is USD
    let usdReserveRaw: bigint | null = null
    if (t0 === USD) usdReserveRaw = r0 as bigint
    else if (t1 === USD) usdReserveRaw = r1 as bigint

    if (!usdReserveRaw) {
      return NextResponse.json({ lpUsd: 0, error: 'USD token not in pair' }, { status: 500 })
    }

    const usdSide = Number(formatUnits(usdReserveRaw, USD_DEC))
    const lpUsd = Math.round(usdSide * 2) // pool has equal value on both sides

    return NextResponse.json({ lpUsd })
  } catch (e) {
    return NextResponse.json({ lpUsd: 0, error: String(e) }, { status: 500 })
  }
}
