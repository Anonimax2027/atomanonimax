import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, MessageCircle, Bitcoin, Users, ArrowRight, Lock, Eye, UserPlus, LogIn } from 'lucide-react';
import { OWNER_SESSION_ID } from '@/lib/supabase';

interface MockProfile {
  anonimax_id: string;
  state: string;
  description: string;
}

interface MockListing {
  title: string;
  category: string;
  state: string;
}

const mockProfiles: MockProfile[] = [
  { anonimax_id: 'ANX-K7M2P9', state: 'SP', description: 'Desenvolvedor Full Stack' },
  { anonimax_id: 'ANX-R4T8N1', state: 'RJ', description: 'Consultor de Investimentos' },
  { anonimax_id: 'ANX-L5W3Q6', state: 'MG', description: 'Designer Gráfico' },
  { anonimax_id: 'ANX-H9B2X4', state: 'BA', description: 'Professor de Idiomas' },
  { anonimax_id: 'ANX-F1C7Y8', state: 'RS', description: 'Especialista em Marketing' },
];

const mockListings: MockListing[] = [
  { title: 'Desenvolvimento de Sites Profissionais', category: 'Serviços', state: 'SP' },
  { title: 'Consultoria em Criptomoedas', category: 'Serviços', state: 'RJ' },
  { title: 'Apartamento para Alugar - Centro', category: 'Imóveis', state: 'MG' },
  { title: 'Venda de Equipamentos de Som', category: 'Produtos', state: 'BA' },
  { title: 'Busco Amizades para Trilhas', category: 'Amizades', state: 'PR' },
  { title: 'Aulas Particulares de Inglês', category: 'Serviços', state: 'RS' },
];

export function Home() {
  const handleContactSession = () => {
    navigator.clipboard.writeText(OWNER_SESSION_ID);
    alert(`ID Session copiado!\n\n${OWNER_SESSION_ID}\n\nAbra o app Session e inicie uma conversa com este ID.`);
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Mensagens via Session',
      description: 'Comunique-se via Session, o mensageiro descentralizado com criptografia de ponta a ponta.',
      color: 'cyan',
    },
    {
      icon: Bitcoin,
      title: 'Pagamentos em Crypto',
      description: 'Aceite e faça pagamentos em BRZ, USDT, USDC, BTC e ETH.',
      color: 'emerald',
    },
    {
      icon: Shield,
      title: 'Anonimato Total',
      description: 'Nenhum dado pessoal necessário. Sua identidade permanece protegida.',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/30" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8">
            <Lock className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">Anonimato Garantido</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Sua Identidade,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Seu Controle
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Anonimax é a plataforma de anonimato completo para suas conversas via Session 
            e pagamentos em criptomoedas. Crie seu perfil anônimo e descubra serviços 
            com total confidencialidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                <UserPlus className="h-5 w-5" />
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <LogIn className="h-5 w-5" />
                Entrar
              </Button>
            </Link>
          </div>

          {/* Contact Session Button */}
          <Button 
            variant="ghost" 
            className="gap-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
            onClick={handleContactSession}
          >
            <MessageCircle className="h-5 w-5" />
            Me contatar no Session
          </Button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-slate-400">Anônimo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">E2E</div>
              <div className="text-sm text-slate-400">Criptografado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-slate-400">Dados Pessoais</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Anonimax combina as melhores tecnologias de privacidade para oferecer 
              uma experiência totalmente anônima.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group overflow-hidden bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                    feature.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                    feature.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Profiles Section */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Perfis Anônimos
            </h2>
            <p className="text-slate-400">
              Descubra usuários e entre em contato de forma segura
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockProfiles.map((profile, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-mono text-cyan-400 font-bold">{profile.anonimax_id}</div>
                    <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">{profile.state}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{profile.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-1" disabled>
                      <MessageCircle className="h-4 w-4" />
                      Conversar
                    </Button>
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 gap-1" disabled>
                      <Bitcoin className="h-4 w-4" />
                      Pagar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA for non-logged users */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
            <CardContent className="p-8 text-center">
              <Eye className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Quer ver a lista completa?
              </h3>
              <p className="text-slate-400 mb-6">
                Apenas usuários cadastrados podem ver todos os perfis e entrar em contato.
                <br />
                <strong className="text-white">A inscrição é gratuita!</strong>
              </p>
              <Link to="/register">
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
                  <UserPlus className="h-5 w-5" />
                  Criar Conta Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mock Listings Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Anúncios
            </h2>
            <p className="text-slate-400">
              Serviços, produtos, imóveis, encontros e muito mais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockListings.map((listing, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">{listing.category}</span>
                    <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">{listing.state}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{listing.title}</h3>
                  <p className="text-slate-500 text-sm">Clique para ver mais detalhes...</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA for non-logged users */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Quer ver todos os anúncios?
              </h3>
              <p className="text-slate-400 mb-6">
                Cadastre-se gratuitamente para acessar todos os anúncios e publicar os seus.
              </p>
              <Link to="/register">
                <Button className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500">
                  <UserPlus className="h-5 w-5" />
                  Inscrever-se Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comece em 3 passos
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Cadastre-se com seu email',
                description: 'Informe apenas seu email. Você receberá um link de verificação.',
              },
              {
                step: '02',
                title: 'Receba seu Anonimax ID',
                description: 'Após verificar seu email, você receberá seu ID único (ANX-XXXXXX) e senha provisória.',
              },
              {
                step: '03',
                title: 'Configure seu perfil',
                description: 'Adicione seu ID Session, endereço crypto e comece a usar a plataforma.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
                <ArrowRight className="h-5 w-5" />
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Precisa de ajuda?
          </h2>
          <p className="text-slate-400 mb-6">
            Entre em contato conosco via Session para suporte ou dúvidas.
          </p>
          <Button 
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleContactSession}
          >
            <MessageCircle className="h-5 w-5" />
            Me contatar no Session
          </Button>
        </div>
      </section>
    </div>
  );
}