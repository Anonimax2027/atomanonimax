import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, adminStorage, BRAZILIAN_STATES } from '@/lib/api';
import {
  Shield,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface Stats {
  users: { total: number; verified: number };
  listings: { total: number; active: number; pending: number };
  payments: { pending: number; verified: number; total_revenue: number };
}

interface User {
  id: string;
  email: string;
  anonimax_id: string;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
}

interface Listing {
  id: string;
  anonimax_id: string;
  title: string;
  content: string;
  category: string;
  state?: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Payment {
  id: string;
  anonimax_id: string;
  listing_id?: string;
  amount: number;
  currency: string;
  network: string;
  tx_hash?: string;
  type: string;
  status: string;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'listings' | 'payments'>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [listingFilter, setListingFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    const token = adminStorage.get();
    if (token) {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      await api.admin.login(email, password);
      setIsLoggedIn(true);
      loadData();
    } catch (err: any) {
      setLoginError(err?.data?.detail || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [statsRes, usersRes, listingsRes, paymentsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.listUsers(),
        api.admin.listListings(),
        api.admin.listPayments(),
      ]);

      setStats(statsRes);
      setUsers(usersRes?.users || []);
      setListings(listingsRes?.listings || []);
      setPayments(paymentsRes?.payments || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handleLogout = () => {
    api.admin.logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleVerifyPayment = async (paymentId: string, action: 'verify' | 'reject') => {
    try {
      await api.admin.verifyPayment(paymentId, action);
      loadData();
    } catch (err) {
      console.error('Error verifying payment:', err);
    }
  };

  const handleListingAction = async (listingId: string, action: 'approve' | 'reject') => {
    try {
      await api.admin.listingAction(listingId, action);
      loadData();
    } catch (err) {
      console.error('Error with listing action:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário e todos os seus dados?')) {
      return;
    }
    try {
      await api.admin.deleteUser(userId);
      loadData();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filteredListings = listingFilter
    ? listings.filter((l) => l.status === listingFilter)
    : listings;

  const filteredPayments = paymentFilter
    ? payments.filter((p) => p.status === paymentFilter)
    : payments;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Painel Admin</h1>
            <p className="text-gray-400">Anonimax</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@anonimax.com"
                  className="bg-gray-900/50 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-900/50 border-gray-600 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold text-white">Admin Anonimax</span>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-gray-600 text-gray-300">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'listings', label: 'Anúncios', icon: FileText },
            { id: 'payments', label: 'Pagamentos', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Usuários</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-bold">{stats.users.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Verificados</span>
                  <span className="text-green-400 font-bold">{stats.users.verified}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Anúncios</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-bold">{stats.listings.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ativos</span>
                  <span className="text-green-400 font-bold">{stats.listings.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pendentes</span>
                  <span className="text-yellow-400 font-bold">{stats.listings.pending}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-8 w-8 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Pagamentos</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pendentes</span>
                  <span className="text-yellow-400 font-bold">{stats.payments.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Verificados</span>
                  <span className="text-green-400 font-bold">{stats.payments.verified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Receita Total</span>
                  <span className="text-white font-bold">
                    {stats.payments.total_revenue.toFixed(2)} BRZ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Anonimax ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Criado em</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <code className="text-purple-400 font-mono text-sm">{user.anonimax_id}</code>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{user.email}</td>
                      <td className="px-4 py-3">
                        {user.is_verified ? (
                          <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle className="h-3 w-3" />
                            Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-yellow-400 text-sm">
                            <Clock className="h-3 w-3" />
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex gap-2 mb-4">
              {['', 'pending', 'active', 'rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    listingFilter === filter
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filter === '' ? 'Todos' : filter === 'pending' ? 'Pendentes' : filter === 'active' ? 'Ativos' : 'Rejeitados'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-purple-400 font-mono text-sm">{listing.anonimax_id}</code>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                          {listing.category}
                        </span>
                        {listing.state && (
                          <span className="text-xs text-gray-500">
                            {BRAZILIAN_STATES.find((s) => s.value === listing.state)?.label}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{listing.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{listing.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(listing.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm text-center ${
                          listing.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : listing.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {listing.status === 'active' ? 'Ativo' : listing.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </span>
                      {listing.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleListingAction(listing.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleListingAction(listing.id, 'reject')}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex gap-2 mb-4">
              {['', 'pending', 'verified', 'rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPaymentFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    paymentFilter === filter
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filter === '' ? 'Todos' : filter === 'pending' ? 'Pendentes' : filter === 'verified' ? 'Verificados' : 'Rejeitados'}
                </button>
              ))}
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Anonimax ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Valor</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Rede</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">TX Hash</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-700/30">
                        <td className="px-4 py-3">
                          <code className="text-purple-400 font-mono text-sm">{payment.anonimax_id}</code>
                        </td>
                        <td className="px-4 py-3 text-white font-medium">
                          {payment.amount} {payment.currency}
                        </td>
                        <td className="px-4 py-3 text-gray-300">{payment.network}</td>
                        <td className="px-4 py-3">
                          {payment.tx_hash ? (
                            <a
                              href={`https://polygonscan.com/tx/${payment.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <span className="font-mono text-xs">
                                {payment.tx_hash.slice(0, 10)}...
                              </span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              payment.status === 'verified'
                                ? 'bg-green-500/20 text-green-400'
                                : payment.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {payment.status === 'verified' ? 'Verificado' : payment.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          {payment.status === 'pending' && payment.tx_hash && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleVerifyPayment(payment.id, 'verify')}
                                className="bg-green-600 hover:bg-green-700 h-7 px-2"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyPayment(payment.id, 'reject')}
                                className="border-red-500 text-red-400 hover:bg-red-500/10 h-7 px-2"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}