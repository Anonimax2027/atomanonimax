import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnonymaxIdDisplay } from '@/components/AnonymaxIdDisplay';
import { ListingCard } from '@/components/ListingCard';
import { useToast } from '@/components/ui/toast';
import { client, generateAnonymaxId, CRYPTO_TYPES, CITIES } from '@/lib/api';
import { User, Save, Plus, MessageCircle, Wallet, MapPin, FileText, Loader2 } from 'lucide-react';

interface DashboardProps {
  user: { id: string } | null;
}

interface Profile {
  id: number;
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
  tags: string;
  created_at: string;
}

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [formData, setFormData] = useState({
    session_id: '',
    crypto_address: '',
    crypto_type: 'XMR',
    city: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadProfile();
    loadListings();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      const response = await client.entities.profiles.query({ query: {} });
      if (response.data.items && response.data.items.length > 0) {
        const existingProfile = response.data.items[0];
        setProfile(existingProfile);
        setFormData({
          session_id: existingProfile.session_id || '',
          crypto_address: existingProfile.crypto_address || '',
          crypto_type: existingProfile.crypto_type || 'XMR',
          city: existingProfile.city || '',
          bio: existingProfile.bio || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadListings = async () => {
    try {
      const response = await client.entities.listings.query({ 
        query: {},
        sort: '-created_at',
        limit: 10 
      });
      setListings(response.data.items || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile) {
        await client.entities.profiles.update({
          id: String(profile.id),
          data: {
            ...formData,
            updated_at: new Date().toISOString(),
          },
        });
        setProfile({ ...profile, ...formData });
        addToast('Profil mis à jour avec succès !', 'success');
      } else {
        const newAnonymaxId = generateAnonymaxId();
        const response = await client.entities.profiles.create({
          data: {
            anonimax_id: newAnonymaxId,
            ...formData,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mon Tableau de Bord</h1>
          <p className="text-slate-400">Gérez votre profil anonyme et vos annonces</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-cyan-400" />
                      Mon Profil
                    </CardTitle>
                    <CardDescription>
                      Configurez vos informations de contact anonymes
                    </CardDescription>
                  </div>
                  {profile && (
                    <AnonymaxIdDisplay id={profile.anonimax_id} size="md" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session ID */}
                <div className="space-y-2">
                  <Label htmlFor="session_id" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-cyan-400" />
                    Session ID
                  </Label>
                  <Input
                    id="session_id"
                    placeholder="05a1b2c3d4e5f6..."
                    value={formData.session_id}
                    onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">
                    Votre identifiant Session pour les messages chiffrés
                  </p>
                </div>

                {/* Crypto */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crypto_type" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-emerald-400" />
                      Crypto préférée
                    </Label>
                    <Select
                      value={formData.crypto_type}
                      onValueChange={(value) => setFormData({ ...formData, crypto_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {CRYPTO_TYPES.map((crypto) => (
                          <SelectItem key={crypto.value} value={crypto.value}>
                            {crypto.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crypto_address">Adresse Wallet</Label>
                    <Input
                      id="crypto_address"
                      placeholder="Votre adresse de portefeuille"
                      value={formData.crypto_address}
                      onChange={(e) => setFormData({ ...formData, crypto_address: e.target.value })}
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    Ville
                  </Label>
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
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Une courte description de vous ou de vos services..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {profile ? 'Mettre à jour' : 'Créer mon profil'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/listings/new')}
                >
                  <Plus className="h-4 w-4" />
                  Créer une annonce
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/search')}
                >
                  <User className="h-4 w-4" />
                  Rechercher un profil
                </Button>
              </CardContent>
            </Card>

            {/* Profile Status */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statut du profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Session ID</span>
                    <Badge variant={profile.session_id ? 'success' : 'secondary'}>
                      {profile.session_id ? 'Configuré' : 'Non configuré'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Wallet</span>
                    <Badge variant={profile.crypto_address ? 'success' : 'secondary'}>
                      {profile.crypto_address ? 'Configuré' : 'Non configuré'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ville</span>
                    <Badge variant={profile.city ? 'success' : 'secondary'}>
                      {profile.city || 'Non définie'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* My Listings */}
        {listings.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Mes Annonces</h2>
              <Button variant="outline" onClick={() => navigate('/listings/new')} className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle annonce
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}