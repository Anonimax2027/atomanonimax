import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Download, Smartphone, Monitor, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function SessionGuide() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">Guia do Session</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">O que é o Session?</h1>
                <p className="text-slate-400">Mensageiro descentralizado com criptografia de ponta a ponta</p>
              </div>
            </div>
            <p className="text-slate-300">
              Session é um aplicativo de mensagens que não requer número de telefone ou email para criar uma conta.
              Todas as mensagens são criptografadas de ponta a ponta e roteadas através de uma rede descentralizada,
              garantindo máxima privacidade e anonimato.
            </p>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-cyan-400" />
              1. Baixar o Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400">
              Baixe o Session gratuitamente para seu dispositivo:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Mobile */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="h-6 w-6 text-cyan-400" />
                  <span className="text-white font-medium">Celular</span>
                </div>
                <div className="space-y-3">
                  <a
                    href="https://apps.apple.com/app/session-private-messenger/id1470168868"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <span className="text-white">iOS (iPhone)</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=network.loki.messenger"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <span className="text-white">Android</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Desktop */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="h-6 w-6 text-purple-400" />
                  <span className="text-white font-medium">Computador</span>
                </div>
                <div className="space-y-3">
                  <a
                    href="https://getsession.org/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <span className="text-white">Windows / Mac / Linux</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Account */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              2. Criar sua Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">Abra o aplicativo</h4>
                  <p className="text-slate-400 text-sm">Após instalar, abra o Session no seu dispositivo.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Clique em "Criar Session ID"</h4>
                  <p className="text-slate-400 text-sm">
                    O aplicativo gerará automaticamente um ID único para você.
                    Não é necessário email ou telefone!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium">Salve sua frase de recuperação</h4>
                  <p className="text-slate-400 text-sm">
                    Anote as palavras de recuperação em um lugar seguro.
                    Você precisará delas para recuperar sua conta.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get Session ID */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Copy className="h-5 w-5 text-purple-400" />
              3. Encontrar seu Session ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400">
              Seu Session ID é um código longo que identifica você na rede. Para encontrá-lo:
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">Abra o menu de configurações</h4>
                  <p className="text-slate-400 text-sm">Toque no ícone de perfil ou configurações.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Seu Session ID aparecerá na tela</h4>
                  <p className="text-slate-400 text-sm">
                    É um código longo começando com "05". Exemplo:
                  </p>
                  <div className="mt-2 p-3 rounded bg-slate-800 flex items-center gap-2">
                    <code className="text-cyan-400 text-xs break-all flex-1">
                      05a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium">Copie e cole no Anonimax</h4>
                  <p className="text-slate-400 text-sm">
                    Copie seu Session ID e adicione no seu perfil Anonimax para que outros usuários
                    possam entrar em contato com você.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Admin */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Precisa de ajuda?</h3>
            <p className="text-slate-400 mb-6">
              Entre em contato com o administrador do Anonimax via Session:
            </p>
            <div className="p-4 rounded-lg bg-slate-800/50 mb-4">
              <code className="text-cyan-400 text-xs break-all">
                055b6c64f73fd6286156ad142b783cff64ef57e1e8444de2c0bd1781587e505368
              </code>
            </div>
            <Button
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleCopy('055b6c64f73fd6286156ad142b783cff64ef57e1e8444de2c0bd1781587e505368')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado!' : 'Copiar Session ID'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}