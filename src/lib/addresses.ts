// src/lib/addresses.ts

// All addresses come from your .env.local so we can swap per-network
export const FACTORY = (process.env.NEXT_PUBLIC_FACTORY_ADDR ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`;

export const SHBT = (process.env.NEXT_PUBLIC_SHBT_ADDR ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`;

export const TREASURY = (process.env.NEXT_PUBLIC_TREASURY_ADDR ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Quick guards (optional): throw if not set in production
export const assertAddresses = () => {
  if (process.env.NODE_ENV === 'production') {
    if (FACTORY.startsWith('0x0000')) throw new Error('FACTORY address not set');
    if (TREASURY.startsWith('0x0000')) throw new Error('TREASURY address not set');
  }
};
