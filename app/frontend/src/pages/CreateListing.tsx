import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { client, CRYPTO_TYPES } from '@/lib/api';
import { ArrowLeft, Loader2, Send, AlertCircle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface User {
  data?: {
    id: string;
  };
}

interface Subscription {
  id: number;
  plan_type: string;
  single_credits?: number;
  monthly_posts_today?: number;
  monthly_expires_at?: string;
  last_post_date?: string;
}

const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg',
  'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Toulon', 'Grenoble',
  'Autre'
];

const MAX_DAILY_POSTS = 3;

export function CreateListing() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    price: '',
    crypto_type: 'BTC',
    tags: '',
  });

  useEffect(() => {
    checkAuth();
    loadCategories();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await client.auth.me();
      if (userData?.data?.id) {
        setUser(userData);
        await checkSubscription();
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

  const checkSubscription = async () => {
    try {
      const response = await client.entities.subscriptions.query({
        sort: '-created_at',
        limit: 1
      });
      
      const subs = response.data.items || [];
      
      if (subs.length === 0) {
        setCanPost(false);
        setSubscriptionMessage('Vous n\'avez pas d\'abonnement actif. Achetez un plan pour publier des annonces.');
        return;
      }

      const activeSub = subs[0];
      setSubscription(activeSub);

      const today = new Date().toISOString().split('T')[0];

      if (activeSub.plan_type === 'single') {
        if (activeSub.single_credits && activeSub.single_credits > 0) {
          setCanPost(true);
          setSubscriptionMessage(`Vous avez ${activeSub.single_credits} crédit(s) d'annonce unique.`);
        } else {
          setCanPost(false);
          setSubscriptionMessage('Vous avez utilisé tous vos crédits d\'annonce unique. Achetez un nouveau plan.');
        }
      } else if (activeSub.plan_type === 'monthly') {
        // Vérifier si l'abonnement mensuel est expiré
        if (activeSub.monthly_expires_at && activeSub.monthly_expires_at < today) {
          setCanPost(false);
          setSubscriptionMessage('Votre abonnement mensuel a expiré. Renouvelez-le pour continuer à publier.');
          return;
        }

        // Vérifier la limite quotidienne
        let postsToday = activeSub.monthly_posts_today || 0;
        
        // Réinitialiser le compteur si c'est un nouveau jour
        if (activeSub.last_post_date !== today) {
          postsToday = 0;
        }

        if (postsToday < MAX_DAILY_POSTS) {
          setCanPost(true);
          const remaining = MAX_DAILY_POSTS - postsToday;
          setSubscriptionMessage(`Abonnement mensuel actif. ${remaining} annonce(s) restante(s) aujourd'hui.`);
        } else {
          setCanPost(false);
          setSubscriptionMessage('Vous avez atteint la limite de 3 annonces par jour. Revenez demain !');
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setCanPost(false);
      setSubscriptionMessage('Erreur lors de la vérification de l\'abonnement.');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await client.entities.categories.queryAll({
        sort: 'name',
      });
      setCategories(response.data.items || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.data?.id) {
      addToast('Vous devez être connecté', 'error');
      return;
    }

    if (!canPost) {
      addToast('Vous n\'avez pas d\'abonnement actif', 'error');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      addToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Créer l'annonce
      await client.entities.listings.create({
        data: {
          user_id: user.data.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          city: formData.city,
          price: parseFloat(formData.price),
          crypto_type: formData.crypto_type,
          tags: formData.tags,
        },
      });

      // Mettre à jour l'abonnement
      if (subscription) {
        const today = new Date().toISOString().split('T')[0];
        
        if (subscription.plan_type === 'single') {
          // Décrémenter le crédit
          await client.entities.subscriptions.update({
            id: String(subscription.id),
            data: {
              single_credits: (subscription.single_credits || 1) - 1,
              updated_at: new Date().toISOString()
            }
          });
        } else if (subscription.plan_type === 'monthly') {
          // Incrémenter le compteur quotidien
          let postsToday = subscription.monthly_posts_today || 0;
          if (subscription.last_post_date !== today) {
            postsToday = 0;
          }
          
          await client.entities.subscriptions.update({
            id: String(subscription.id),
            data: {
              monthly_posts_today: postsToday + 1,
              last_post_date: today,
              updated_at: new Date().toISOString()
            }
          });
        }
      }
      
      addToast('Annonce créée avec succès !', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
      addToast('Erreur lors de la création', 'error');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Subscription Status Alert */}
        {!canPost ? (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Abonnement requis</AlertTitle>
            <AlertDescription className="text-slate-300">
              {subscriptionMessage}
              <Link to="/pricing" className="block mt-3">
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
                  <CreditCard className="h-4 w-4" />
                  Voir les plans
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10">
            <AlertCircle className="h-4 w-4 text-emerald-500" />
            <AlertTitle className="text-emerald-500">Abonnement actif</AlertTitle>
            <AlertDescription className="text-slate-300">
              {subscriptionMessage}
            </AlertDescription>
          </Alert>
        )}

        <Card className={!canPost ? 'opacity-50 pointer-events-none' : ''}>
          <CardHeader>
            <CardTitle>Créer une annonce</CardTitle>
            <CardDescription>
              Publiez votre service ou offre de manière anonyme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Développement web freelance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={!canPost}
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
                  disabled={!canPost}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                  disabled={!canPost}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
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

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData({ ...formData, city: value })}
                  disabled={!canPost}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ville (optionnel)" />
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

              {/* Price and Crypto */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    disabled={!canPost}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crypto_type">Crypto *</Label>
                  <Select
                    value={formData.crypto_type}
                    onValueChange={(value) => setFormData({ ...formData, crypto_type: value })}
                    disabled={!canPost}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Mots-clés</Label>
                <Input
                  id="tags"
                  placeholder="web, design, crypto (séparés par des virgules)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  disabled={!canPost}
                />
                <p className="text-xs text-slate-500">
                  Ajoutez des mots-clés pour améliorer la visibilité
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting || !canPost}
                className="w-full gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
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