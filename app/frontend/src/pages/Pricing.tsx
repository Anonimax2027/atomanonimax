import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@metagptx/web-sdk';

const client = createClient();

// Adresse USDC pour recevoir les paiements (à remplacer par votre adresse)
const PAYMENT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: 'single',
    name: 'Annonce Unique',
    price: 5,
    currency: 'USDC',
    description: 'Publiez une annonce à la fois',
    features: [
      '1 annonce active',
      'Durée illimitée',
      'Modification à tout moment',
      'Contact via Session',
      'Paiement unique'
    ],
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 'monthly',
    name: 'Abonnement Mensuel',
    price: 20,
    currency: 'USDC',
    description: 'Publiez jusqu\'à 3 annonces par jour',
    features: [
      'Jusqu\'à 3 annonces/jour',
      'Annonces illimitées actives',
      'Priorité dans les résultats',
      'Badge "Pro" sur le profil',
      'Support prioritaire',
      'Renouvellement mensuel'
    ],
    popular: true,
    icon: <Crown className="h-6 w-6" />
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPlan = async (plan: Plan) => {
    // Vérifier si l'utilisateur est connecté
    const user = await client.auth.me();
    if (!user.data) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour acheter un plan.',
        variant: 'destructive'
      });
      await client.auth.toLogin();
      return;
    }
    
    setSelectedPlan(plan);
    setIsPaymentDialogOpen(true);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESS);
    toast({
      title: 'Adresse copiée',
      description: 'L\'adresse USDC a été copiée dans le presse-papier.'
    });
  };

  const handleSubmitPayment = async () => {
    if (!txHash.trim()) {
      toast({
        title: 'Hash requis',
        description: 'Veuillez entrer le hash de la transaction.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer l'enregistrement de paiement
      const paymentResponse = await client.entities.payments.create({
        data: {
          plan_type: selectedPlan?.id || '',
          amount: selectedPlan?.price || 0,
          crypto_type: 'USDC',
          tx_hash: txHash.trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      });

      if (paymentResponse.data) {
        // Créer ou mettre à jour l'abonnement
        const subscriptionData: Record<string, unknown> = {
          plan_type: selectedPlan?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (selectedPlan?.id === 'single') {
          subscriptionData.single_credits = 1;
        } else if (selectedPlan?.id === 'monthly') {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
          subscriptionData.monthly_expires_at = expiresAt.toISOString().split('T')[0];
          subscriptionData.monthly_posts_today = 0;
          subscriptionData.last_post_date = new Date().toISOString().split('T')[0];
        }

        await client.entities.subscriptions.create({
          data: subscriptionData
        });

        toast({
          title: 'Paiement soumis',
          description: 'Votre paiement est en cours de vérification. Vous serez notifié une fois confirmé.'
        });

        setIsPaymentDialogOpen(false);
        setTxHash('');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission du paiement.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30">
            Tarification
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Publiez vos annonces de manière anonyme avec paiement en USDC.
            Profil gratuit, annonces payantes.
          </p>
        </div>

        {/* Free Profile Info */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5 border-[#10B981]/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#10B981]/20 rounded-full">
                  <Check className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Profil Gratuit</h3>
                  <p className="text-[#94A3B8]">
                    Créez votre profil anonyme gratuitement avec une brève description et votre ID Session.
                    Aucun paiement requis pour être visible dans l'annuaire.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-[#1A1A25] border-[#2D2D3A] hover:border-[#00D9FF]/50 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-[#8B5CF6]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#8B5CF6] text-white">
                    Plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto p-3 rounded-full mb-4 ${
                  plan.popular ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-[#00D9FF]/20 text-[#00D9FF]'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-[#94A3B8]">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-xl text-[#10B981] ml-2">{plan.currency}</span>
                  {plan.id === 'monthly' && (
                    <span className="text-[#94A3B8] block text-sm mt-1">/mois</span>
                  )}
                </div>
                
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-[#10B981] flex-shrink-0" />
                      <span className="text-[#94A3B8]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#00D9FF] hover:opacity-90' 
                      : 'bg-[#00D9FF] hover:bg-[#00D9FF]/90'
                  } text-white`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Choisir ce plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Payment Info */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card className="bg-[#12121A] border-[#2D2D3A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-[#10B981]">💎</span>
                Paiement en USDC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#94A3B8]">
              <p>
                Nous acceptons uniquement les paiements en <strong className="text-[#10B981]">USDC</strong> sur 
                les réseaux suivants :
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-[#00D9FF]/30 text-[#00D9FF]">Ethereum</Badge>
                <Badge variant="outline" className="border-[#8B5CF6]/30 text-[#8B5CF6]">Polygon</Badge>
                <Badge variant="outline" className="border-[#10B981]/30 text-[#10B981]">Arbitrum</Badge>
                <Badge variant="outline" className="border-[#F59E0B]/30 text-[#F59E0B]">Base</Badge>
              </div>
              <p className="text-sm">
                Après avoir effectué le paiement, soumettez le hash de la transaction pour vérification.
                Votre plan sera activé dans les 24 heures suivant la confirmation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="bg-[#1A1A25] border-[#2D2D3A] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Paiement - {selectedPlan?.name}</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Envoyez {selectedPlan?.price} USDC à l'adresse ci-dessous
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Amount */}
            <div className="text-center p-4 bg-[#12121A] rounded-lg">
              <p className="text-sm text-[#94A3B8] mb-1">Montant à payer</p>
              <p className="text-3xl font-bold text-[#10B981]">
                {selectedPlan?.price} USDC
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-[#94A3B8]">Adresse de paiement (USDC)</Label>
              <div className="flex gap-2">
                <Input 
                  value={PAYMENT_ADDRESS}
                  readOnly
                  className="bg-[#12121A] border-[#2D2D3A] text-[#00D9FF] font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-[#2D2D3A] hover:bg-[#2D2D3A]"
                  onClick={copyAddress}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Réseaux acceptés: Ethereum, Polygon, Arbitrum, Base
              </p>
            </div>

            {/* Transaction Hash */}
            <div className="space-y-2">
              <Label className="text-[#94A3B8]">Hash de la transaction</Label>
              <Input 
                placeholder="0x..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="bg-[#12121A] border-[#2D2D3A] text-white font-mono"
              />
              <p className="text-xs text-[#94A3B8]">
                Entrez le hash après avoir effectué le paiement
              </p>
            </div>

            {/* Help Link */}
            <a 
              href="https://support.metamask.io/transactions-and-gas/transactions/how-to-find-a-transaction-id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#00D9FF] hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Comment trouver le hash de transaction ?
            </a>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentDialogOpen(false)}
              className="border-[#2D2D3A] text-white hover:bg-[#2D2D3A]"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitPayment}
              disabled={isSubmitting || !txHash.trim()}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#00D9FF] text-white"
            >
              {isSubmitting ? 'Envoi...' : 'Soumettre le paiement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}