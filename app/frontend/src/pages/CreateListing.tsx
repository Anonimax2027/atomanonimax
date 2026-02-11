import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  ArrowLeft,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Bitcoin,
} from 'lucide-react';
import { BRAZILIAN_STATES, LISTING_CATEGORIES, PAYMENT_ADDRESS } from '@/lib/supabase';

export function CreateListing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [createdListing, setCreatedListing] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');

  const token = localStorage.getItem('anonimax_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  // Check for personal info in real-time
  useEffect(() => {
    const checkText = (text: string): string[] => {
      const issues: string[] = [];
      
      // Email
      if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi.test(text)) {
        issues.push('Email detectado');
      }
      
      // Phone
      if (/(\+55\s?)?(\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/g.test(text)) {
        issues.push('Número de telefone detectado');
      }
      
      // WhatsApp
      if (/whatsapp|wpp|zap|whats/gi.test(text)) {
        issues.push('Referência ao WhatsApp detectada');
      }
      
      // CPF
      if (/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g.test(text)) {
        issues.push('CPF detectado');
      }
      
      return issues;
    };

    const titleIssues = checkText(title);
    const contentIssues = checkText(content);
    setWarnings([...titleIssues, ...contentIssues]);
  }, [title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (warnings.length > 0) {
      setError('Remova as informações de identificação pessoal antes de continuar.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1/listings/create?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, state: state || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.detail === 'object') {
          throw new Error(data.detail.message);
        }
        throw new Error(data.detail || 'Erro ao criar anúncio');
      }

      setCreatedListing(data);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar anúncio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESS.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-slate-950">
        <header className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Pagamento</span>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Bitcoin className="h-8 w-8 text-orange-400" />
              </div>
              <CardTitle className="text-white">Anúncio Criado!</CardTitle>
              <CardDescription className="text-slate-400">
                Para ativar seu anúncio, envie o pagamento abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Info */}
              <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-1">
                    {PAYMENT_ADDRESS.amount} {PAYMENT_ADDRESS.crypto}
                  </div>
                  <div className="text-slate-400">na rede {PAYMENT_ADDRESS.network}</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase">Endereço para pagamento</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-3 rounded bg-slate-900 text-cyan-400 text-sm break-all">
                        {PAYMENT_ADDRESS.address}
                      </code>
                      <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                        {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <h4 className="text-white font-medium mb-2">Após o pagamento:</h4>
                <ol className="text-sm text-slate-400 space-y-2">
                  <li>1. Copie o hash da transação (TX Hash)</li>
                  <li>2. Entre em contato com o administrador via Session</li>
                  <li>3. Envie seu Anonimax ID e o hash da transação</li>
                  <li>4. Seu anúncio será ativado após verificação</li>
                </ol>
              </div>

              {/* BRZ Guide */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm text-emerald-400 mb-2">
                  💡 Não tem BRZ? Compre via PIX no app Chainless!
                </p>
                <Link to="/brz-guide">
                  <Button variant="link" className="text-cyan-400 p-0 h-auto gap-1">
                    Ver guia de compra
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link to="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Voltar ao Dashboard
                  </Button>
                </Link>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    navigator.clipboard.writeText('055b6c64f73fd6286156ad142b783cff64ef57e1e8444de2c0bd1781587e505368');
                    alert('ID Session do administrador copiado!\n\nAbra o app Session para enviar o comprovante.');
                  }}
                >
                  Contatar Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">Novo Anúncio</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              Criar Anúncio
            </CardTitle>
            <CardDescription className="text-slate-400">
              Preencha os dados do seu anúncio. Custo: 10 BRZ (Polygon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Informações de identificação detectadas!</span>
                  </div>
                  <ul className="text-sm text-red-300 space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-400 mt-2">
                    Remova essas informações para manter seu anonimato.
                  </p>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Título do Anúncio</label>
                <Input
                  placeholder="Ex: Desenvolvimento de Sites Profissionais"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500">{title.length}/200 caracteres</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Categoria</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {LISTING_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.code} value={cat.code}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Estado (opcional)</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Descrição do Anúncio</label>
                <Textarea
                  placeholder="Descreva seu serviço, produto ou o que você está buscando. NÃO inclua informações pessoais como email, telefone ou WhatsApp."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={5000}
                  required
                  className="bg-slate-800 border-slate-700 text-white min-h-40"
                />
                <p className="text-xs text-slate-500">{content.length}/5000 caracteres</p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Info */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <h4 className="text-white font-medium mb-2">ℹ️ Importante:</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Não inclua informações pessoais (email, telefone, CPF, WhatsApp)</li>
                  <li>• Os interessados entrarão em contato via Session</li>
                  <li>• Seu anúncio será ativado após confirmação do pagamento</li>
                </ul>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || warnings.length > 0 || !category}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Anúncio (10 BRZ)'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}