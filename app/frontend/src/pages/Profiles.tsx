import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Search,
  MessageCircle,
  Bitcoin,
  Heart,
  Loader2,
  ArrowLeft,
  User,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import { BRAZILIAN_STATES } from '@/lib/supabase';

interface Profile {
  id: string;
  anonimax_id: string;
  session_id?: string;
  crypto_type?: string;
  crypto_network?: string;
  crypto_address?: string;
  state?: string;
  description?: string;
  created_at: string;
}

export function Profiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const token = localStorage.getItem('anonimax_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfiles();
  }, [navigate, token, stateFilter]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      let url = `/api/v1/profiles/?token=${token}`;
      if (stateFilter !== 'all') url += `&state=${stateFilter}`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProfiles();
  };

  const handleContactSession = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    alert(`ID Session copiado!\n\n${sessionId}\n\nAbra o app Session e inicie uma conversa com este ID.`);
  };

  const handleCopyAddress = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddFavorite = async (anonimax_id: string) => {
    try {
      const response = await fetch(`/api/v1/profiles/favorites?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_anonimax_id: anonimax_id }),
      });

      if (response.ok) {
        alert('Perfil adicionado aos favoritos!');
      } else {
        const data = await response.json();
        alert(data.detail || 'Erro ao adicionar favorito');
      }
    } catch (err) {
      console.error('Error adding favorite:', err);
    }
  };

  const getStateName = (code: string) => {
    const state = BRAZILIAN_STATES.find((s) => s.code === code);
    return state?.name || code;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Perfis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar por Anonimax ID ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              {BRAZILIAN_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum perfil encontrado</h3>
              <p className="text-slate-400">Tente ajustar os filtros de busca.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-mono text-cyan-400 font-bold text-lg">{profile.anonimax_id}</div>
                    {profile.state && (
                      <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile.state}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {profile.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{profile.description}</p>
                  )}

                  {/* Crypto Info */}
                  {profile.crypto_type && (
                    <div className="mb-4 p-3 rounded-lg bg-slate-800/50">
                      <div className="text-xs text-slate-500 mb-1">Aceita pagamentos em:</div>
                      <div className="flex items-center gap-2">
                        <Bitcoin className="h-4 w-4 text-orange-400" />
                        <span className="text-white text-sm">
                          {profile.crypto_type} ({profile.crypto_network})
                        </span>
                      </div>
                      {profile.crypto_address && (
                        <div className="mt-2 flex items-center gap-2">
                          <code className="text-xs text-slate-400 truncate flex-1">
                            {profile.crypto_address.slice(0, 20)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyAddress(profile.crypto_address!, profile.id)}
                          >
                            {copiedId === profile.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {profile.session_id ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-1"
                        onClick={() => handleContactSession(profile.session_id!)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Conversar
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1 bg-slate-700 gap-1" disabled>
                        <MessageCircle className="h-4 w-4" />
                        Sem Session
                      </Button>
                    )}
                    {profile.crypto_address && (
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 gap-1"
                        onClick={() => handleCopyAddress(profile.crypto_address!, profile.id)}
                      >
                        <Bitcoin className="h-4 w-4" />
                        Pagar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleAddFavorite(profile.anonimax_id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}