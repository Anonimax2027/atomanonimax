import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, MessageCircle, Bitcoin, Users, Search, ArrowRight, Lock, Eye } from 'lucide-react';
import { client } from '@/lib/api';

interface HomeProps {
  user: { id: string } | null;
}

export function Home({ user }: HomeProps) {
  const handleLogin = async () => {
    await client.auth.toLogin();
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Messagerie Session',
      description: 'Communiquez via Session, le messager décentralisé et chiffré de bout en bout.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/962065/2026-02-09/0b8ac68b-a8e3-4c7c-809d-27281dfd0557.png',
      color: 'cyan',
    },
    {
      icon: Bitcoin,
      title: 'Paiements Crypto',
      description: 'Acceptez et effectuez des paiements en Bitcoin, Ethereum, Monero et plus.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/962065/2026-02-09/5fec8f3e-1705-4f51-a57e-7d03433a9bd7.png',
      color: 'emerald',
    },
    {
      icon: Shield,
      title: 'Anonymat Total',
      description: 'Aucune donnée personnelle requise. Votre identité reste protégée.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/962065/2026-02-09/5882c9bf-3131-46de-b3b7-0c1a2c1da454.png',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url(https://mgx-backend-cdn.metadl.com/generate/images/962065/2026-02-09/19f61c13-3a77-49fb-adbc-03f0a629ac67.png)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8">
            <Lock className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">Anonymat Garanti</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Votre Identité,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Votre Contrôle
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Anonimax est la plateforme d'anonymat complet pour vos conversations via Session 
            et paiements en crypto-monnaies. Créez votre profil anonyme et découvrez des services 
            en toute confidentialité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Mon Tableau de Bord
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    <Search className="h-5 w-5" />
                    Explorer les Annonces
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button size="lg" onClick={handleLogin} className="w-full sm:w-auto gap-2">
                  Créer mon Anonimax ID
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Link to="/listings">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    <Eye className="h-5 w-5" />
                    Voir les Annonces
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-slate-400">Anonyme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">E2E</div>
              <div className="text-sm text-slate-400">Chiffré</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-slate-400">Données Perso</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-slate-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Anonimax combine les meilleures technologies de confidentialité pour vous offrir 
              une expérience totalement anonyme.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
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

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Commencez en 3 étapes
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Créez votre Anonimax ID',
                description: 'Inscrivez-vous et recevez automatiquement un identifiant unique ANX-XXXXXX.',
              },
              {
                step: '02',
                title: 'Configurez votre profil',
                description: 'Ajoutez votre ID Session et votre adresse crypto préférée.',
              },
              {
                step: '03',
                title: 'Explorez et proposez',
                description: 'Recherchez des services ou publiez vos propres annonces.',
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
            {!user && (
              <Button size="lg" onClick={handleLogin} className="gap-2">
                <Users className="h-5 w-5" />
                Rejoindre Anonimax
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}