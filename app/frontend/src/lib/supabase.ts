import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les tables Supabase
export interface User {
  id: string;
  email: string;
  anonimax_id: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  anonimax_id: string;
  session_id?: string;
  crypto_type?: string;
  crypto_network?: string;
  crypto_address?: string;
  state?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  anonimax_id: string;
  title: string;
  content: string;
  category: string;
  state?: string;
  status: 'pending' | 'active' | 'rejected';
  payment_status: 'pending' | 'paid' | 'verified';
  payment_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  target_anonimax_id: string;
  custom_name?: string;
  custom_description?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  anonimax_id: string;
  amount: number;
  currency: string;
  network: string;
  tx_hash?: string;
  status: 'pending' | 'verified' | 'rejected';
  type: 'listing' | 'subscription';
  created_at: string;
}

// États du Brésil
export const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
];

// Types de crypto supportés
export const CRYPTO_TYPES = [
  { code: 'BRZ', name: 'BRZ (Brazilian Digital Token)', networks: ['Polygon', 'Ethereum', 'BSC'] },
  { code: 'USDT', name: 'Tether (USDT)', networks: ['Polygon', 'Ethereum', 'BSC', 'Tron'] },
  { code: 'USDC', name: 'USD Coin (USDC)', networks: ['Polygon', 'Ethereum', 'BSC'] },
  { code: 'BTC', name: 'Bitcoin (BTC)', networks: ['Bitcoin'] },
  { code: 'ETH', name: 'Ethereum (ETH)', networks: ['Ethereum', 'Polygon', 'Arbitrum'] },
];

// Catégories d'annonces
export const LISTING_CATEGORIES = [
  { code: 'services', name: 'Serviços' },
  { code: 'products', name: 'Produtos' },
  { code: 'real_estate', name: 'Imóveis' },
  { code: 'dating', name: 'Encontros' },
  { code: 'friendship', name: 'Amizades' },
  { code: 'hobbies', name: 'Hobbies e Paixões' },
  { code: 'jobs', name: 'Empregos' },
  { code: 'other', name: 'Outros' },
];

// Adresse BRZ pour paiements
export const PAYMENT_ADDRESS = {
  crypto: 'BRZ',
  network: 'Polygon',
  address: '0xda9811524aec92900905e5352be766ea84ddbf24',
  amount: 10,
};

// ID Session du propriétaire
export const OWNER_SESSION_ID = '055b6c64f73fd6286156ad142b783cff64ef57e1e8444de2c0bd1781587e505368';

// Générer un Anonimax ID unique
export function generateAnonymaxId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ANX-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Générer un mot de passe provisoire
export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Vérifier si le texte contient des informations d'identification
export function checkForPersonalInfo(text: string): { hasPersonalInfo: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Regex pour email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  if (emailRegex.test(text)) {
    issues.push('Email detectado');
  }
  
  // Regex pour téléphone brésilien
  const phoneRegex = /(\+55\s?)?(\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/g;
  if (phoneRegex.test(text)) {
    issues.push('Número de telefone detectado');
  }
  
  // Regex pour WhatsApp
  const whatsappRegex = /whatsapp|wpp|zap|whats/gi;
  if (whatsappRegex.test(text)) {
    issues.push('Referência ao WhatsApp detectada');
  }
  
  // Regex pour CPF
  const cpfRegex = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g;
  if (cpfRegex.test(text)) {
    issues.push('CPF detectado');
  }
  
  return {
    hasPersonalInfo: issues.length > 0,
    issues,
  };
}

// Ouvrir Session avec un ID
export function openSessionChat(sessionId: string): void {
  // Format: session:SESSIONID
  window.open(`https://getsession.org/`, '_blank');
  // Note: Session n'a pas de deep link web standard, on copie l'ID
}