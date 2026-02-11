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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Shield,
  Search,
  MessageCircle,
  Bitcoin,
  Loader2,
  ArrowLeft,
  FileText,
  MapPin,
  Copy,
  Check,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { BRAZILIAN_STATES, LISTING_CATEGORIES } from '@/lib/supabase';

interface Listing {
  id: string;
  anonimax_id: string;
  title: string;
  content: string;
  category: string;
  state?: string;
  status: string;
  created_at: string;
}

interface ListingDetail {
  listing: Listing;
  profile: {
    session_id?: string;
    crypto_type?: string;
    crypto_network?: string;
    crypto_address?: string;
  } | null;
}

export function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const token = localStorage.getItem('anonimax_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchListings();
  }, [navigate, token, stateFilter, categoryFilter]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      let url = `/api/v1/listings/?token=${token}`;
      if (stateFilter !== 'all') url += `&state=${stateFilter}`;
      if (categoryFilter !== 'all') url += `&category=${categoryFilter}`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings();
  };

  const handleViewListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/v1/listings/${listingId}?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedListing(data);
        setIsDialogOpen(true);
      }
    } catch (err) {
      console.error('Error fetching listing detail:', err);
    }
  };

  const handleContactSession = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    alert(`ID Session copiado!\n\n${sessionId}\n\nAbra o app Session e inicie uma conversa com este ID.`);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const getCategoryName = (code: string) => {
    const category = LISTING_CATEGORIES.find((c) => c.code === code);
    return category?.name || code;
  };

  const getCategoryColor = (code: string) => {
    const colors: Record<string, string> = {
      services: 'bg-cyan-500/20 text-cyan-400',
      products: 'bg-emerald-500/20 text-emerald-400',
      real_estate: 'bg-purple-500/20 text-purple-400',
      dating: 'bg-pink-500/20 text-pink-400',
      friendship: 'bg-yellow-500/20 text-yellow-400',
      hobbies: 'bg-orange-500/20 text-orange-400',
      jobs: 'bg-blue-500/20 text-blue-400',
      other: 'bg-slate-500/20 text-slate-400',
    };
    return colors[code] || colors.other;
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
              <span className="text-xl font-bold text-white">Anúncios</span>
            </div>
          </div>
          <Link to="/create-listing">
            <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
              <Plus className="h-4 w-4" />
              Novo Anúncio
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar anúncios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {LISTING_CATEGORIES.map((cat) => (
                <SelectItem key={cat.code} value={cat.code}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum anúncio encontrado</h3>
              <p className="text-slate-400 mb-6">Tente ajustar os filtros de busca ou crie o primeiro anúncio.</p>
              <Link to="/create-listing">
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
                  <Plus className="h-4 w-4" />
                  Criar Anúncio
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => handleViewListing(listing.id)}
              >
                <CardContent className="p-6">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(listing.category)}`}>
                      {getCategoryName(listing.category)}
                    </span>
                    {listing.state && (
                      <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.state}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{listing.title}</h3>

                  {/* Content Preview */}
                  <p className="text-slate-400 text-sm line-clamp-3 mb-4">{listing.content}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 text-sm">{listing.anonimax_id}</span>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Ver mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Listing Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          {selectedListing && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(selectedListing.listing.category)}`}>
                    {getCategoryName(selectedListing.listing.category)}
                  </span>
                  {selectedListing.listing.state && (
                    <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">
                      {selectedListing.listing.state}
                    </span>
                  )}
                </div>
                <DialogTitle className="text-white text-xl">{selectedListing.listing.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Content */}
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedListing.listing.content}</p>
                </div>

                {/* Author Info */}
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400">Anunciante:</span>
                    <span className="font-mono text-cyan-400 font-bold">{selectedListing.listing.anonimax_id}</span>
                  </div>

                  {/* Crypto Info */}
                  {selectedListing.profile?.crypto_type && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 mb-2">Aceita pagamentos em:</div>
                      <div className="flex items-center gap-2">
                        <Bitcoin className="h-4 w-4 text-orange-400" />
                        <span className="text-white">
                          {selectedListing.profile.crypto_type} ({selectedListing.profile.crypto_network})
                        </span>
                      </div>
                      {selectedListing.profile.crypto_address && (
                        <div className="mt-2 flex items-center gap-2 p-2 rounded bg-slate-900">
                          <code className="text-xs text-slate-400 truncate flex-1">
                            {selectedListing.profile.crypto_address}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleCopyAddress(selectedListing.profile!.crypto_address!)}
                          >
                            {copiedAddress ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            Copiar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedListing.profile?.session_id ? (
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                      onClick={() => handleContactSession(selectedListing.profile!.session_id!)}
                    >
                      <MessageCircle className="h-5 w-5" />
                      Conversar via Session
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-slate-700 gap-2" disabled>
                      <MessageCircle className="h-5 w-5" />
                      Session não disponível
                    </Button>
                  )}
                  {selectedListing.profile?.crypto_address && (
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700 gap-2"
                      onClick={() => handleCopyAddress(selectedListing.profile!.crypto_address!)}
                    >
                      <Bitcoin className="h-5 w-5" />
                      Copiar Endereço
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}