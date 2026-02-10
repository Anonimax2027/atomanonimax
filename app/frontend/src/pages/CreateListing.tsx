import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { client, CRYPTO_TYPES, CITIES } from '@/lib/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface CreateListingProps {
  user: { id: string } | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export function CreateListing({ user }: CreateListingProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    price: '',
    crypto_type: 'XMR',
    tags: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadCategories();
  }, [user, navigate]);

  const loadCategories = async () => {
    try {
      const response = await client.entities.categories.query({ query: {} });
      setCategories(response.data.items || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      addToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    setLoading(true);
    try {
      await client.entities.listings.create({
        data: {
          ...formData,
          price: parseFloat(formData.price) || 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
      addToast('Annonce créée avec succès !', 'success');
      navigate('/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      addToast('Erreur lors de la création de l\'annonce', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Créer une annonce</CardTitle>
            <CardDescription>
              Publiez votre service ou annonce pour la communauté Anonimax
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Développement web sur mesure"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre service en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              {/* Category & City */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
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
              </div>

              {/* Price & Crypto */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crypto_type">Crypto acceptée</Label>
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
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Mots-clés</Label>
                <Input
                  id="tags"
                  placeholder="web, design, marketing (séparés par des virgules)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <p className="text-xs text-slate-500">
                  Ajoutez des mots-clés pour améliorer la visibilité de votre annonce
                </p>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Publier l'annonce
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}