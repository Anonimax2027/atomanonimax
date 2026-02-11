import { createClient } from '@metagptx/web-sdk';

export const client = createClient();

// Auth storage
const AUTH_KEY = 'anonimax_auth';

export interface AuthUser {
  id: string;
  email: string;
  anonimax_id: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthData {
  user: AuthUser;
  token: string;
}

export const authStorage = {
  get: (): AuthData | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  set: (data: AuthData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },
  clear: () => {
    localStorage.removeItem(AUTH_KEY);
  },
  getToken: (): string | null => {
    const data = authStorage.get();
    return data?.token || null;
  },
  getUser: (): AuthUser | null => {
    const data = authStorage.get();
    return data?.user || null;
  },
};

// Admin storage
const ADMIN_KEY = 'anonimax_admin';

export const adminStorage = {
  get: (): string | null => {
    return localStorage.getItem(ADMIN_KEY);
  },
  set: (token: string) => {
    localStorage.setItem(ADMIN_KEY, token);
  },
  clear: () => {
    localStorage.removeItem(ADMIN_KEY);
  },
};

// Utility functions
export const getSessionUrl = (sessionId: string): string => {
  return `https://getsession.org/`;
};

export const getCryptoPaymentUrl = (cryptoType: string, address: string): string => {
  const prefixes: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    XMR: 'monero',
    USDT: 'ethereum',
    USDC: 'ethereum',
    BRZ: 'ethereum',
  };
  const prefix = prefixes[cryptoType] || 'ethereum';
  return `${prefix}:${address}`;
};

// API helpers
export const api = {
  // Auth endpoints
  auth: {
    register: async (email: string, password: string) => {
      const response = await client.apiCall.invoke({
        url: '/api/v1/auth/register',
        method: 'POST',
        data: { email, password },
      });
      if (response.data) {
        authStorage.set({ user: response.data.user, token: response.data.token });
      }
      return response.data;
    },
    login: async (email: string, password: string) => {
      const response = await client.apiCall.invoke({
        url: '/api/v1/auth/login',
        method: 'POST',
        data: { email, password },
      });
      if (response.data) {
        authStorage.set({ user: response.data.user, token: response.data.token });
      }
      return response.data;
    },
    verifyEmail: async (token: string) => {
      const response = await client.apiCall.invoke({
        url: '/api/v1/auth/verify-email',
        method: 'POST',
        data: { token },
      });
      return response.data;
    },
    forgotPassword: async (email: string) => {
      const response = await client.apiCall.invoke({
        url: '/api/v1/auth/forgot-password',
        method: 'POST',
        data: { email },
      });
      return response.data;
    },
    resetPassword: async (token: string, password: string) => {
      const response = await client.apiCall.invoke({
        url: '/api/v1/auth/reset-password',
        method: 'POST',
        data: { token, password },
      });
      return response.data;
    },
    logout: () => {
      authStorage.clear();
    },
  },
  // Profile endpoints
  profiles: {
    getMyProfile: async () => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/profiles/me?token=${token}`,
        method: 'GET',
      });
      return response.data;
    },
    updateMyProfile: async (data: {
      session_id?: string;
      crypto_type?: string;
      crypto_network?: string;
      crypto_address?: string;
      state?: string;
      description?: string;
    }) => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/profiles/me?token=${token}`,
        method: 'PUT',
        data,
      });
      return response.data;
    },
    listProfiles: async (params?: { state?: string; search?: string }) => {
      const token = authStorage.getToken();
      let url = `/api/v1/profiles/?token=${token}`;
      if (params?.state) url += `&state=${params.state}`;
      if (params?.search) url += `&search=${encodeURIComponent(params.search)}`;
      const response = await client.apiCall.invoke({
        url,
        method: 'GET',
      });
      return response.data;
    },
    addFavorite: async (target_anonimax_id: string, custom_name?: string, custom_description?: string) => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/profiles/favorites?token=${token}`,
        method: 'POST',
        data: { target_anonimax_id, custom_name, custom_description },
      });
      return response.data;
    },
    listFavorites: async () => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/profiles/favorites/list?token=${token}`,
        method: 'GET',
      });
      return response.data;
    },
    removeFavorite: async (favorite_id: string) => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/profiles/favorites/${favorite_id}?token=${token}`,
        method: 'DELETE',
      });
      return response.data;
    },
  },
  // Listings endpoints
  listings: {
    create: async (data: { title: string; content: string; category: string; state?: string }) => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/listings/create?token=${token}`,
        method: 'POST',
        data,
      });
      return response.data;
    },
    list: async (params?: { state?: string; category?: string; search?: string }) => {
      const token = authStorage.getToken();
      let url = `/api/v1/listings/?token=${token}`;
      if (params?.state) url += `&state=${params.state}`;
      if (params?.category) url += `&category=${params.category}`;
      if (params?.search) url += `&search=${encodeURIComponent(params.search)}`;
      const response = await client.apiCall.invoke({
        url,
        method: 'GET',
      });
      return response.data;
    },
    getMyListings: async () => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/listings/my-listings?token=${token}`,
        method: 'GET',
      });
      return response.data;
    },
    get: async (listing_id: string) => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/listings/${listing_id}?token=${token}`,
        method: 'GET',
      });
      return response.data;
    },
    submitPayment: async (listing_id: string, tx_hash: string) => {
      const token = authStorage.getToken();
      const response = await client.apiCall.invoke({
        url: `/api/v1/listings/submit-payment?token=${token}`,
        method: 'POST',
        data: { listing_id, tx_hash },
      });
      return response.data;
    },
  },
  // Admin endpoints
  admin: {
    login: async (email: string, password: string) => {
      const response = await client.apiCall.invoke({
        url: '/api/v1/admin/login',
        method: 'POST',
        data: { email, password },
      });
      if (response.data?.token) {
        adminStorage.set(response.data.token);
      }
      return response.data;
    },
    getStats: async () => {
      const token = adminStorage.get();
      const response = await client.apiCall.invoke({
        url: `/api/v1/admin/stats?admin_token=${token}`,
        method: 'GET',
      });
      return response.data;
    },
    listUsers: async () => {
      const token = adminStorage.get();
      const response = await client.apiCall.invoke({
        url: `/api/v1/admin/users?admin_token=${token}`,
        method: 'GET',
      });
      return response.data;
    },
    listListings: async (status?: string) => {
      const token = adminStorage.get();
      let url = `/api/v1/admin/listings?admin_token=${token}`;
      if (status) url += `&status=${status}`;
      const response = await client.apiCall.invoke({
        url,
        method: 'GET',
      });
      return response.data;
    },
    listPayments: async (status?: string) => {
      const token = adminStorage.get();
      let url = `/api/v1/admin/payments?admin_token=${token}`;
      if (status) url += `&status=${status}`;
      const response = await client.apiCall.invoke({
        url,
        method: 'GET',
      });
      return response.data;
    },
    verifyPayment: async (payment_id: string, action: 'verify' | 'reject') => {
      const token = adminStorage.get();
      const response = await client.apiCall.invoke({
        url: `/api/v1/admin/payments/verify?admin_token=${token}`,
        method: 'POST',
        data: { payment_id, action },
      });
      return response.data;
    },
    listingAction: async (listing_id: string, action: 'approve' | 'reject') => {
      const token = adminStorage.get();
      const response = await client.apiCall.invoke({
        url: `/api/v1/admin/listings/action?admin_token=${token}`,
        method: 'POST',
        data: { listing_id, action },
      });
      return response.data;
    },
    deleteUser: async (user_id: string) => {
      const token = adminStorage.get();
      const response = await client.apiCall.invoke({
        url: `/api/v1/admin/users/${user_id}?admin_token=${token}`,
        method: 'DELETE',
      });
      return response.data;
    },
    logout: () => {
      adminStorage.clear();
    },
  },
};

// Crypto types
export const CRYPTO_TYPES = [
  { value: 'BRZ', label: 'BRZ (Real Digital)', networks: ['Polygon', 'Ethereum', 'BSC'] },
  { value: 'USDT', label: 'USDT (Tether)', networks: ['Polygon', 'Ethereum', 'BSC', 'Tron'] },
  { value: 'USDC', label: 'USDC', networks: ['Polygon', 'Ethereum', 'BSC'] },
  { value: 'BTC', label: 'Bitcoin', networks: ['Bitcoin', 'Lightning'] },
  { value: 'ETH', label: 'Ethereum', networks: ['Ethereum', 'Polygon', 'Arbitrum'] },
  { value: 'XMR', label: 'Monero', networks: ['Monero'] },
];

// Brazilian states
export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

// Listing categories
export const LISTING_CATEGORIES = [
  { value: 'servicos', label: 'Serviços' },
  { value: 'produtos', label: 'Produtos' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'outros', label: 'Outros' },
];