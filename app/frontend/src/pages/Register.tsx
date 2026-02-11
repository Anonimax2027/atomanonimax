import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Eye, EyeOff, Shield, Lock, Mail, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ anonimax_id: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await api.auth.register(email, password);
      if (result?.user) {
        setSuccess({
          anonimax_id: result.user.anonimax_id,
          message: result.message,
        });
      }
    } catch (err: any) {
      setError(err?.data?.detail || err?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Conta Criada!</h1>
            
            <div className="bg-purple-500/10 border border-purple-500/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-2">Seu Anonimax ID:</p>
              <p className="text-2xl font-mono font-bold text-purple-400">{success.anonimax_id}</p>
            </div>
            
            <p className="text-gray-400 mb-6">{success.message}</p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Ir para o Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/session-guide')}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Configurar Session ID
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Shield className="h-10 w-10 text-purple-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Anonimax
            </span>
          </Link>
          <p className="text-gray-400 mt-2">Crie sua identidade anônima</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Criar Conta</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usado apenas para recuperação de conta
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
            >
              {loading ? 'Criando conta...' : 'Criar Conta Anônima'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem conta?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            🔒 Não coletamos dados pessoais além do email
          </p>
          <p className="text-gray-500 text-sm">
            🎭 Você receberá um Anonimax ID único e anônimo
          </p>
        </div>
      </div>
    </div>
  );
}