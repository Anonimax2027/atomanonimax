import { createClient } from '@metagptx/web-sdk';

export const client = createClient();

// Generate unique Anonimax ID
export function generateAnonymaxId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ANX-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Crypto types supported
export const CRYPTO_TYPES = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'XMR', label: 'Monero (XMR)' },
  { value: 'LTC', label: 'Litecoin (LTC)' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'SOL', label: 'Solana (SOL)' },
];

// French cities
export const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg',
  'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Toulon',
  'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Saint-Étienne',
  'International', 'En ligne'
];