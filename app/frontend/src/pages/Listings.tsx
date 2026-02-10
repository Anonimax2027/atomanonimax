import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListingCard } from '@/components/ListingCard';
import { client, CITIES } from '@/lib/api';
import { Search, Plus, Filter, X, Loader2 } from 'lucide-react';

interface ListingsProps {
  user: { id: string } | null;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string;
  price: number;
  crypto_type: string;
  tags: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export function Listings({ user }: ListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
    loadListings();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await client.entities.categories.query({ query: {} });
      setCategories(response.data.items || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await client.entities.listings.queryAll({
        query: {},
        sort: '-created_at',
        limit: 50,
      });
      setListings(response.data.items || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      searchTerm === '' ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.tags?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'all' || listing.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;

    return matchesSearch && matchesCity && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchTerm || selectedCity !== 'all' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Annonces & Services</h1>
            <p className="text-slate-400">
              Découvrez les services proposés par la communauté Anonimax
            </p>
          </div>
          {user && (
            <Link to="/listings/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une annonce
              </Button>
            </Link>
          )}
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Rechercher par titre, description ou mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="md:hidden gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filtres
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Effacer
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="w-full gap-2">
                  <X className="h-4 w-4" />
                  Effacer les filtres
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune annonce trouvée</h3>
            <p className="text-slate-400 mb-6">
              {hasActiveFilters
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Soyez le premier à publier une annonce !'}
            </p>
            {user && (
              <Link to="/listings/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Créer une annonce
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-slate-400 mb-6">
              {filteredListings.length} annonce{filteredListings.length > 1 ? 's' : ''} trouvée
              {filteredListings.length > 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}