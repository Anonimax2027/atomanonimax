import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnonymaxIdDisplay } from '@/components/AnonymaxIdDisplay';
import { ListingCard } from '@/components/ListingCard';
import { useToast } from '@/components/ui/toast';
import { client, generateAnonymaxId, CRYPTO_TYPES, CITIES } from '@/lib/api';
import { Plus, Save, Loader2, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';

interface Profile {
  id?: number;
  user_id: string;
  anonimax_id: string;
  session_id: string;
  crypto_address: string;
  crypto_type: string;
  city: string;
  bio: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string;
  price: number;
  crypto_type: string;
  created_at: string;
}

interface User {
  data?: {
    id: string;
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    session_id: '',
    crypto_address: '',
    crypto_type: 'BTC',
    city: '',
    bio: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await client.auth.me();
      if (userData?.data?.id) {
        setUser(userData);
        await loadProfile(userData.data.id);
        await loadListings();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const response = await client.entities.profiles.query({
        query: { user_id: userId },
        limit: 1,
      });
      
      if (response.data.items && response.data.items.length > 0) {
        const existingProfile = response.data.items[0];
        setProfile(existingProfile);
        setFormData({
          session_id: existingProfile.session_id || '',
          crypto_address: existingProfile.crypto_address || '',
          crypto_type: existingProfile.crypto_type || 'BTC',
          city: existingProfile.city || '',
          bio: existingProfile.bio || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadListings = async () => {
    try {
      const response = await client.entities.listings.query({
        sort: '-created_at',
        limit: 10,
      });
      setListings(response.data.items || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.data?.id) return;
    
    setSaving(true);
    try {
      if (profile?.id) {
        // Update existing profile
        await client.entities.profiles.update({
          id: String(profile.id),
          data: {
            ...formData,
          },
        });
        setProfile({ ...profile, ...formData });
        addToast('Profil mis à jour !', 'success');
      } else {
        // Create new profile
        const newProfile = {
          user_id: user.data.id,
          anonimax_id: generateAnonymaxId(),
          ...formData,
        };
        const response = await client.entities.profiles.create({
          data: newProfile,
        });
        setProfile(response.data);
        addToast('Profil créé avec succès !', 'success');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    try {
      await client.entities.listings.delete({ id: String(listingId) });
      setListings(listings.filter(l => l.id !== listingId));
      addToast('Annonce supprimée', 'success');
    } catch (error) {
      console.error('Error deleting listing:', error);
      addToast('Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-slate-400">Gérez votre profil anonyme et vos annonces</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Votre Profil</CardTitle>
                <CardDescription>Configurez vos informations de contact anonymes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Anonimax ID */}
                {profile?.anonimax_id && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <Label className="text-slate-400 text-sm">Votre Anonimax ID</Label>
                    <div className="mt-2">
                      <AnonymaxIdDisplay id={profile.anonimax_id} size="lg" />
                    </div>
                  </div>
                )}

                {/* Session ID */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="session_id">Session ID</Label>
                    <Link
                      to="/guide/session"
                      className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <HelpCircle className="h-3 w-3" />
                      Comment obtenir mon ID ?
                    </Link>
                  </div>
                  <Input
                    id="session_id"
                    placeholder="05abc123..."
                    value={formData.session_id}
                    onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">
                    Votre ID Session pour la messagerie chiffrée
                  </p>
                </div>

                {/* Crypto Type */}
                <div className="space-y-2">
                  <Label htmlFor="crypto_type">Crypto-monnaie</Label>
                  <Select
                    value={formData.crypto_type}
                    onValueChange={(value) => setFormData({ ...formData, crypto_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une crypto" />
                    </SelectTrigger>
                    <SelectContent>
                      {CRYPTO_TYPES.map((crypto) => (
                        <SelectItem key={crypto} value={crypto}>
                          {crypto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Crypto Address */}
                <div className="space-y-2">
                  <Label htmlFor="crypto_address">Adresse {formData.crypto_type}</Label>
                  <Input
                    id="crypto_address"
                    placeholder="Votre adresse de réception"
                    value={formData.crypto_address}
                    onChange={(e) => setFormData({ ...formData, crypto_address: e.target.value })}
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Décrivez-vous brièvement..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full gap-2"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {profile ? 'Mettre à jour' : 'Créer le profil'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Listings Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Vos Annonces</CardTitle>
                  <CardDescription>Gérez vos services et offres</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadListings}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/create-listing')}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nouvelle annonce
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 mb-4">Vous n'avez pas encore d'annonces</p>
                    <Button onClick={() => navigate('/create-listing')} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Créer votre première annonce
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onDelete={() => handleDeleteListing(listing.id)}
                        showActions
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}