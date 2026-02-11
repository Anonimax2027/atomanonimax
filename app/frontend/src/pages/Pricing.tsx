import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { client } from '@/lib/api';
import { Check, ArrowLeft, Loader2, Copy, ExternalLink, Shield, Zap, Crown, Wallet, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Endereço BRZ para pagamentos (Polygon)
const BRZ_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Perfil Grátis',
    price: 0,
    currency: 'BRZ',
    description: 'Crie seu perfil anônimo gratuitamente',
    features: [
      'Anonimax ID único (ANX-XXXXXX)',
      'Perfil com descrição',
      'ID Session para contato',
      'Endereço crypto',
      'Visibilidade na busca',
    ],
    icon: Shield,
  },
  {
    id: 'single',
    name: 'Anúncio Único',
    price: 10,
    currency: 'BRZ',
    description: 'Publique um anúncio de serviço',
    features: [
      '1 anúncio ativo',
      'Duração ilimitada',
      'Edição a qualquer momento',
      'Visibilidade nos resultados',
      'Contato via Session',
    ],
    icon: Zap,
  },
  {
    id: 'monthly',
    name: 'Assinatura Mensal',
    price: 60,
    currency: 'BRZ',
    description: 'Para anunciantes frequentes',
    features: [
      'Até 3 anúncios por dia',
      'Anúncios ilimitados no mês',
      'Badge "Pro" no perfil',
      'Prioridade nos resultados',
      'Suporte prioritário',
    ],
    popular: true,
    icon: Crown,
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.id === 'free') {
      // Redirecionar para criar perfil
      try {
        const user = await client.auth.me();
        if (user?.data?.id) {
          navigate('/dashboard');
        } else {
          await client.auth.toLogin();
        }
      } catch {
        await client.auth.toLogin();
      }
      return;
    }

    // Verificar se o usuário está logado
    try {
      const user = await client.auth.me();
      if (!user?.data?.id) {
        addToast('Você precisa estar logado para assinar um plano', 'error');
        await client.auth.toLogin();
        return;
      }
    } catch {
      await client.auth.toLogin();
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BRZ_ADDRESS);
      setCopied(true);
      addToast('Endereço copiado!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Erro ao copiar', 'error');
    }
  };

  const handleSubmitPayment = async () => {
    if (!txHash.trim()) {
      addToast('Por favor, insira o hash da transação', 'error');
      return;
    }

    if (!selectedPlan) return;

    setSubmitting(true);
    try {
      const user = await client.auth.me();
      if (!user?.data?.id) {
        addToast('Erro de autenticação', 'error');
        return;
      }

      // Criar registro de pagamento
      await client.entities.payments.create({
        data: {
          user_id: user.data.id,
          plan_type: selectedPlan.id,
          amount: selectedPlan.price,
          currency: 'BRZ',
          tx_hash: txHash,
          status: 'pending',
          network: 'polygon',
        },
      });

      // Criar ou atualizar assinatura
      const today = new Date().toISOString().split('T')[0];
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await client.entities.subscriptions.create({
        data: {
          user_id: user.data.id,
          plan_type: selectedPlan.id,
          status: 'active',
          single_credits: selectedPlan.id === 'single' ? 1 : 0,
          monthly_posts_today: 0,
          monthly_expires_at: selectedPlan.id === 'monthly' ? expiresAt.toISOString().split('T')[0] : null,
          last_post_date: today,
        },
      });

      addToast('Pagamento registrado! Sua assinatura está ativa.', 'success');
      setShowPaymentDialog(false);
      setTxHash('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      addToast('Erro ao processar pagamento', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Planos e Preços
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades. Pagamento em BRZ via PIX.
          </p>
        </div>

        {/* BRZ Info Alert */}
        <Alert className="mb-8 border-emerald-500/50 bg-emerald-500/10 max-w-2xl mx-auto">
          <Info className="h-4 w-4 text-emerald-500" />
          <AlertTitle className="text-emerald-500">Pagamento em BRZ</AlertTitle>
          <AlertDescription className="text-slate-300">
            <strong>1 BRZ = R$ 1,00</strong> - Sem volatilidade, sem imposto sobre ganho de capital.{' '}
            <a href="/guide/brz" className="text-cyan-400 hover:underline">
              Saiba como comprar BRZ via PIX →
            </a>
          </AlertDescription>
        </Alert>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all hover:scale-105 ${
                plan.popular 
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
                  plan.id === 'free' ? 'bg-slate-500/20 text-slate-400' :
                  plan.id === 'single' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <plan.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">{plan.currency}</span>
                  {plan.id === 'monthly' && (
                    <span className="text-slate-500 text-sm block mt-1">/mês</span>
                  )}
                  {plan.price > 0 && (
                    <span className="text-emerald-400 text-sm block mt-1">
                      = R$ {plan.price},00
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.id === 'free' ? 'text-slate-400' :
                        plan.id === 'single' ? 'text-cyan-400' :
                        'text-purple-400'
                      }`} />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600' 
                      : ''
                  }`}
                  variant={plan.id === 'free' ? 'outline' : 'default'}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.id === 'free' ? 'Criar Perfil Grátis' : 'Assinar Agora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to buy BRZ */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-400" />
              Como comprar BRZ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">
              Compre BRZ facilmente usando PIX através do aplicativo Chainless:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
              <li>Baixe o app Chainless (iOS/Android)</li>
              <li>Crie sua conta e verifique seu CPF</li>
              <li>Deposite reais via PIX</li>
              <li>Compre BRZ (1 BRZ = R$ 1,00)</li>
              <li>Envie para o endereço na página de pagamento</li>
            </ol>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate('/guide/brz')}
            >
              <ExternalLink className="h-4 w-4" />
              Ver guia completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento em BRZ</DialogTitle>
            <DialogDescription>
              Envie {selectedPlan?.price} BRZ para o endereço abaixo (Rede Polygon)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Amount */}
            <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-3xl font-bold text-white">
                {selectedPlan?.price} BRZ
              </div>
              <div className="text-emerald-400 text-sm">
                = R$ {selectedPlan?.price},00
              </div>
              <div className="text-slate-400 text-sm mt-1">
                Plano: {selectedPlan?.name}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Endereço BRZ (Polygon)</Label>
              <div className="flex gap-2">
                <Input 
                  value={BRZ_ADDRESS} 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyAddress}
                >
                  <Copy className={`h-4 w-4 ${copied ? 'text-emerald-400' : ''}`} />
                </Button>
              </div>
              <p className="text-xs text-amber-400">
                ⚠️ Envie apenas BRZ na rede Polygon (MATIC)
              </p>
            </div>

            {/* Network Info */}
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-sm text-cyan-400">
                <strong>Rede:</strong> Polygon (MATIC)<br />
                <strong>Token:</strong> BRZ (Brazilian Digital Token)
              </p>
            </div>

            {/* TX Hash */}
            <div className="space-y-2">
              <Label htmlFor="txHash">Hash da Transação</Label>
              <Input
                id="txHash"
                placeholder="0x..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-slate-500">
                Cole o hash da transação após enviar o pagamento
              </p>
            </div>

            {/* Submit */}
            <Button 
              className="w-full gap-2"
              onClick={handleSubmitPayment}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Confirmar Pagamento
            </Button>

            {/* Help Link */}
            <p className="text-center text-sm text-slate-400">
              Não tem BRZ?{' '}
              <a href="/guide/brz" className="text-cyan-400 hover:underline">
                Saiba como comprar via PIX
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Pricing;