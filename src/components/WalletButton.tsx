'use client';
import React from 'react';
import { useEthereum } from '../hooks/useEthereum';

type Props = {
  size?: 'sm' | 'md';
  variant?: 'solid' | 'ghost';
  className?: string;
};

export default function WalletButton({ size='md', variant='ghost', className='' }: Props) {
  const { ready, short, connect } = useEthereum();

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
  }[size];

  const variants = {
    solid: 'bg-white/10 hover:bg-white/20 border border-white/20',
    ghost: 'bg-transparent hover:bg-white/10 border border-white/10',
  }[variant];

  return (
    <button
      onClick={connect}
      disabled={!ready}
      className={`${sizes} ${variants} text-white disabled:opacity-50 ${className}`}
    >
      {short ? short : (ready ? 'Connect Wallet' : 'No Wallet')}
    </button>
  );
}
