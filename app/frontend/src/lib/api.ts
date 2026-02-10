import { createClient } from '@metagptx/web-sdk';

// Create client instance
export const client = createClient();

// Generate unique Anonimax ID
export const generateAnonymaxId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'ANX-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// Supported crypto types
export const CRYPTO_TYPES = ['BTC', 'ETH', 'USDT', 'USDC'] as const;
export type CryptoType = typeof CRYPTO_TYPES[number];

// Crypto display names
export const CRYPTO_NAMES: Record<CryptoType, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'Tether USD',
  USDC: 'USD Coin',
};

// Cities list
export const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg',
  'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Toulon', 'Grenoble',
  'Autre'
];

// Crypto payment URL generators (without amount)
export const getCryptoPaymentUrl = (cryptoType: string, address: string): string => {
  switch (cryptoType?.toUpperCase()) {
    case 'BTC':
      return `bitcoin:${address}`;
    case 'ETH':
      return `ethereum:${address}`;
    case 'USDT':
      // USDT is typically on Ethereum or Tron, use ethereum format
      return `ethereum:${address}`;
    case 'USDC':
      // USDC is typically on Ethereum, use ethereum format
      return `ethereum:${address}`;
    default:
      return `bitcoin:${address}`;
  }
};

// Session deep link
export const getSessionUrl = (sessionId: string): string => {
  return `session:${sessionId}`;
};