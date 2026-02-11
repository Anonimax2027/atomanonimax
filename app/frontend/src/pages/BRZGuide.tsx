import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Download, Smartphone, Copy, Check, Bitcoin, ExternalLink, QrCode } from 'lucide-react';
import { useState } from 'react';
import { PAYMENT_ADDRESS } from '@/lib/supabase';

export function BRZGuide() {
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
            <span className="text-xl font-bold text-white">Guia BRZ</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Bitcoin className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">O que é BRZ?</h1>
                <p className="text-slate-400">Stablecoin brasileira pareada 1:1 com o Real</p>
              </div>
            </div>
            <p className="text-slate-300">
              BRZ é uma stablecoin (criptomoeda estável) que mantém paridade com o Real brasileiro.
              1 BRZ = 1 BRL. É a forma mais fácil de usar criptomoedas para pagamentos no Brasil,
              pois você não precisa se preocupar com volatilidade.
            </p>
          </CardContent>
        </Card>

        {/* Why BRZ */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Por que usar BRZ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50">
                <h4 className="text-emerald-400 font-medium mb-2">✅ Estabilidade</h4>
                <p className="text-slate-400 text-sm">Valor fixo em Real, sem volatilidade</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50">
                <h4 className="text-emerald-400 font-medium mb-2">✅ Taxas Baixas</h4>
                <p className="text-slate-400 text-sm">Transferências baratas na rede Polygon</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50">
                <h4 className="text-emerald-400 font-medium mb-2">✅ Rapidez</h4>
                <p className="text-slate-400 text-sm">Transações confirmadas em segundos</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50">
                <h4 className="text-emerald-400 font-medium mb-2">✅ Privacidade</h4>
                <p className="text-slate-400 text-sm">Pagamentos sem vincular conta bancária</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chainless App */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-cyan-400" />
              1. Baixar o App Chainless
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400">
              Chainless é o app mais fácil para comprar BRZ via PIX no Brasil.
              Não precisa de conta em exchange!
            </p>

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-6 w-6 text-cyan-400" />
                <span className="text-white font-medium">Baixar Chainless</span>
              </div>
              <div className="space-y-3">
                <a
                  href="https://apps.apple.com/br/app/chainless/id1629693686"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <span className="text-white">iOS (iPhone)</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.chainless"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <span className="text-white">Android</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400">
                ⚠️ Importante: O Chainless requer verificação de identidade (KYC) para compras via PIX.
                Isso é exigido por regulamentação brasileira, mas seus dados ficam apenas no Chainless.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buy BRZ */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <QrCode className="h-5 w-5 text-emerald-400" />
              2. Comprar BRZ via PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">Abra o app Chainless</h4>
                  <p className="text-slate-400 text-sm">Faça login ou crie sua conta.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Selecione "Comprar"</h4>
                  <p className="text-slate-400 text-sm">Escolha BRZ como a moeda que deseja comprar.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium">Informe o valor</h4>
                  <p className="text-slate-400 text-sm">
                    Digite quanto deseja comprar (ex: R$ 10,00 = 10 BRZ).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-white font-medium">Pague via PIX</h4>
                  <p className="text-slate-400 text-sm">
                    Escaneie o QR Code ou copie o código PIX para pagar.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  5
                </div>
                <div>
                  <h4 className="text-white font-medium">Receba seus BRZ</h4>
                  <p className="text-slate-400 text-sm">
                    Após confirmação do PIX, os BRZ serão creditados na sua carteira Chainless.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send BRZ */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-orange-400" />
              3. Enviar BRZ para Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400">
              Para pagar um anúncio no Anonimax, envie BRZ para o endereço abaixo:
            </p>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {PAYMENT_ADDRESS.amount} BRZ
                </div>
                <div className="text-slate-400">Rede: Polygon</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase">Endereço</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 rounded bg-slate-900 text-cyan-400 text-sm break-all">
                    {PAYMENT_ADDRESS.address}
                  </code>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(PAYMENT_ADDRESS.address)}>
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">No Chainless, toque em "Enviar"</h4>
                  <p className="text-slate-400 text-sm">Selecione BRZ e a rede Polygon.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Cole o endereço acima</h4>
                  <p className="text-slate-400 text-sm">
                    Certifique-se de que está enviando na rede Polygon!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium">Confirme o envio</h4>
                  <p className="text-slate-400 text-sm">
                    Após enviar, copie o hash da transação (TX Hash).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-white font-medium">Envie o comprovante via Session</h4>
                  <p className="text-slate-400 text-sm">
                    Entre em contato com o administrador e envie seu Anonimax ID + TX Hash.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="bg-red-500/10 border-red-500/30 mb-8">
          <CardContent className="p-6">
            <h4 className="text-red-400 font-bold mb-2">⚠️ Atenção!</h4>
            <ul className="text-sm text-red-300 space-y-2">
              <li>• Sempre verifique se está enviando na rede <strong>Polygon</strong></li>
              <li>• Enviar na rede errada pode resultar em perda dos fundos</li>
              <li>• Confira o endereço antes de confirmar a transação</li>
              <li>• Guarde o hash da transação como comprovante</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <Bitcoin className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Dúvidas sobre pagamento?</h3>
            <p className="text-slate-400 mb-6">
              Entre em contato com o administrador via Session para suporte.
            </p>
            <Button
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleCopy('055b6c64f73fd6286156ad142b783cff64ef57e1e8444de2c0bd1781587e505368')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar Session ID do Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}