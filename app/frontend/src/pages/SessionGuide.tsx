import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Smartphone, Monitor, Copy, CheckCircle, ExternalLink, Shield, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SessionGuide() {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: 'Télécharger Session',
      description: 'Choisissez votre plateforme et téléchargez l\'application Session',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Session est une application de messagerie chiffrée de bout en bout, décentralisée et anonyme.
            Aucun numéro de téléphone ou email requis.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://getsession.org/download"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Monitor className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">Desktop</p>
                <p className="text-sm text-slate-400">Windows, macOS, Linux</p>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-500 ml-auto" />
            </a>
            <a
              href="https://getsession.org/download"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Smartphone className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-emerald-400 transition-colors">Mobile</p>
                <p className="text-sm text-slate-400">iOS, Android</p>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-500 ml-auto" />
            </a>
          </div>
          <div className="flex justify-center pt-2">
            <a
              href="https://getsession.org/download"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400">
                <Download className="h-4 w-4" />
                Télécharger Session
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Créer votre compte Session',
      description: 'Lancez l\'application et créez un nouveau compte',
      content: (
        <div className="space-y-4">
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center">1</span>
              <span>Ouvrez l'application Session</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center">2</span>
              <span>Cliquez sur <Badge variant="secondary">"Créer un compte"</Badge> ou <Badge variant="secondary">"Create Session ID"</Badge></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center">3</span>
              <span>Choisissez un nom d'affichage (peut être n'importe quoi, c'est anonyme)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center">4</span>
              <span><strong className="text-amber-400">Important :</strong> Sauvegardez votre phrase de récupération dans un endroit sûr</span>
            </li>
          </ol>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-400">Conseil de sécurité</p>
                <p className="text-sm text-slate-300 mt-1">
                  Notez votre phrase de récupération sur papier et gardez-la en lieu sûr.
                  C'est le seul moyen de récupérer votre compte si vous perdez votre appareil.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Trouver votre Session ID',
      description: 'Localisez votre identifiant unique Session',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Votre Session ID est un identifiant unique de 66 caractères commençant par <Badge variant="cyan">05</Badge>.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-cyan-400" />
                Sur Desktop (Windows/Mac/Linux)
              </h4>
              <ol className="space-y-2 text-sm text-slate-300">
                <li>1. Cliquez sur votre <strong>photo de profil</strong> en haut à gauche</li>
                <li>2. Votre Session ID s'affiche sous votre nom</li>
                <li>3. Cliquez sur l'ID pour le <strong>copier</strong></li>
              </ol>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                Sur Mobile (iOS/Android)
              </h4>
              <ol className="space-y-2 text-sm text-slate-300">
                <li>1. Appuyez sur l'icône <strong>Paramètres</strong> (engrenage)</li>
                <li>2. Appuyez sur votre <strong>profil</strong> en haut</li>
                <li>3. Votre Session ID s'affiche - appuyez pour <strong>copier</strong></li>
              </ol>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-cyan-500/30">
            <p className="text-sm text-slate-400 mb-2">Exemple de Session ID :</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 rounded bg-slate-900 text-cyan-400 text-xs font-mono break-all">
                05a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
              </code>
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <Copy className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 4,
      title: 'Ajouter votre Session ID sur Anonimax',
      description: 'Renseignez votre ID dans votre profil Anonimax',
      content: (
        <div className="space-y-4">
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center">1</span>
              <span>Connectez-vous à votre compte Anonimax</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center">2</span>
              <span>Allez dans votre <Badge variant="secondary">Tableau de bord</Badge></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center">3</span>
              <span>Collez votre Session ID dans le champ <Badge variant="cyan">"Session ID"</Badge></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center">4</span>
              <span>Cliquez sur <Badge variant="success">"Mettre à jour"</Badge></span>
            </li>
          </ol>
          
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-400">C'est fait !</p>
                <p className="text-sm text-slate-300 mt-1">
                  Les autres utilisateurs pourront maintenant vous contacter directement sur Session
                  via le bouton "Discuter" sur vos annonces.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button onClick={() => navigate('/dashboard')} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Aller au tableau de bord
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
            <span className="text-cyan-400 font-medium">Guide Session</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Comment configurer Session
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Suivez ce guide pour installer Session et récupérer votre ID Session
            afin de l'utiliser sur Anonimax.
          </p>
        </div>

        {/* Why Session */}
        <Card className="mb-8 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Pourquoi Session ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="font-medium text-white mb-1">🔒 Chiffré E2E</p>
                <p className="text-sm text-slate-400">Vos messages sont chiffrés de bout en bout</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="font-medium text-white mb-1">👤 Anonyme</p>
                <p className="text-sm text-slate-400">Aucun numéro de téléphone ou email requis</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="font-medium text-white mb-1">🌐 Décentralisé</p>
                <p className="text-sm text-slate-400">Pas de serveur central, réseau distribué</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <Card key={step.number}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  <div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-[72px]">
                {step.content}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Besoin d'aide ? Consultez la documentation officielle de Session
          </p>
          <a
            href="https://getsession.org/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            FAQ Session
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}