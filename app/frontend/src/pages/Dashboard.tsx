import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api, authStorage, CRYPTO_TYPES, BRAZILIAN_STATES } from '@/lib/api';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Shield,
  Copy,
  Check,
  MessageSquare,
  Wallet,
  MapPin,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  LogOut,
  Star,
  Heart,
} from 'lucide-react';

interface Profile {
  id: string;
  anonimax_id: string;
  session_id?: string;
  crypto_type?: string;
  crypto_network?: string;
  crypto_address?: string;
  state?: string;
  description?: string;
}

interface Listing {
  id: string;
  title: string;
  category: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Favorite {
  id: string;
  target_anonimax_id: string;
  custom_name?: string;
  profile?: {
    session_id?: string;
    state?: string;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'listings' | 'favorites'>('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [sessionId, setSessionId] = useState('');
  const [cryptoType, setCryptoType] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, listingsRes, favoritesRes] = await Promise.all([
        api.profiles.getMyProfile(),
        api.listings.getMyListings(),
        api.profiles.listFavorites(),
      ]);

      if (profileRes) {
        setProfile(profileRes);
        setSessionId(profileRes.session_id || '');
        setCryptoType(profileRes.crypto_type || '');
        setCryptoNetwork(profileRes.crypto_network || '');
        setCryptoAddress(profileRes.crypto_address || '');
        setState(profileRes.state || '');
        setDescription(profileRes.description || '');
      }

      setListings(listingsRes?.listings || []);
      setFavorites(favoritesRes?.favorites || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.profiles.updateMyProfile({
        session_id: sessionId || undefined,
        crypto_type: cryptoType || undefined,
        crypto_network: cryptoNetwork || undefined,
        crypto_address: cryptoAddress || undefined,
        state: state || undefined,
        description: description || undefined,
      });
      setSuccess('Perfil atualizado com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err?.data?.detail || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/');
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      await api.profiles.removeFavorite(favoriteId);
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const selectedCrypto = CRYPTO_TYPES.find((c) => c.value === cryptoType);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meu Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Anonimax ID:</span>
              <code className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded font-mono">
                {user.anonimax_id}
              </code>
              <button
                onClick={() => copyToClipboard(user.anonimax_id)}
                className="text-gray-400 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/create-listing">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Anúncio
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="border-gray-600 text-gray-300">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'listings'
                ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Meus Anúncios ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4 inline mr-2" />
            Favoritos ({favorites.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Session ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  Session ID
                </label>
                <Input
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="05abc123..."
                  className="bg-gray-900/50 border-gray-600 text-white"
                />
                <Link to="/session-guide" className="text-xs text-purple-400 hover:underline mt-1 inline-block">
                  Como obter meu Session ID?
                </Link>
              </div>

              {/* State */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  Estado
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Selecione...</option>
                  {BRAZILIAN_STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crypto Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Wallet className="h-4 w-4 text-purple-400" />
                  Criptomoeda Preferida
                </label>
                <select
                  value={cryptoType}
                  onChange={(e) => {
                    setCryptoType(e.target.value);
                    setCryptoNetwork('');
                  }}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Selecione...</option>
                  {CRYPTO_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Network */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  Rede
                </label>
                <select
                  value={cryptoNetwork}
                  onChange={(e) => setCryptoNetwork(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-md px-3 py-2"
                  disabled={!selectedCrypto}
                >
                  <option value="">Selecione...</option>
                  {selectedCrypto?.networks.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crypto Address */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  Endereço da Carteira
                </label>
                <Input
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-gray-900/50 border-gray-600 text-white font-mono"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  Descrição (máx 1000 caracteres)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva seus serviços ou o que você oferece..."
                  className="bg-gray-900/50 border-gray-600 text-white min-h-[120px]"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/1000 caracteres</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {saving ? 'Salvando...' : 'Salvar Perfil'}
              </Button>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum anúncio ainda</h3>
                <p className="text-gray-400 mb-4">Crie seu primeiro anúncio para começar a receber contatos</p>
                <Link to="/create-listing">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Anúncio
                  </Button>
                </Link>
              </div>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{listing.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="bg-gray-700 px-2 py-1 rounded">{listing.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(listing.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : listing.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {listing.status === 'active' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                      {listing.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                      {listing.status === 'rejected' && <XCircle className="h-3 w-3 inline mr-1" />}
                      {listing.status === 'active'
                        ? 'Ativo'
                        : listing.status === 'pending'
                        ? 'Pendente'
                        : 'Rejeitado'}
                    </span>
                    {/* Payment Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        listing.payment_status === 'verified'
                          ? 'bg-green-500/20 text-green-400'
                          : listing.payment_status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {listing.payment_status === 'verified'
                        ? 'Pago'
                        : listing.payment_status === 'pending'
                        ? 'Aguardando Pagamento'
                        : 'Pagamento Rejeitado'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favorites.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum favorito ainda</h3>
                <p className="text-gray-400 mb-4">Salve perfis interessantes para acessá-los rapidamente</p>
                <Link to="/search">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Buscar Perfis
                  </Button>
                </Link>
              </div>
            ) : (
              favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-mono text-purple-400">{favorite.target_anonimax_id}</span>
                    </div>
                    {favorite.custom_name && (
                      <p className="text-gray-300">{favorite.custom_name}</p>
                    )}
                    {favorite.profile?.state && (
                      <p className="text-sm text-gray-500">
                        {BRAZILIAN_STATES.find((s) => s.value === favorite.profile?.state)?.label}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {favorite.profile?.session_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://getsession.org/`, '_blank')}
                        className="border-gray-600 text-gray-300"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Session
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}