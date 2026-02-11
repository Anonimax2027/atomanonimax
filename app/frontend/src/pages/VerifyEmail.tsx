import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
      setError('Token de verificação não encontrado');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await api.auth.verifyEmail(token);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.data?.detail || 'Erro ao verificar email');
    } finally {
      setLoading(false);
    }
  };

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
        </div>

        {/* Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
          {loading ? (
            <>
              <Loader2 className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-white mb-2">Verificando...</h1>
              <p className="text-gray-400">Aguarde enquanto verificamos seu email.</p>
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Email Verificado!</h1>
              <p className="text-gray-400 mb-6">
                Sua conta foi verificada com sucesso. Agora você pode acessar todos os recursos.
              </p>
              <div className="space-y-3">
                <Link to="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    Ir para o Dashboard
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Fazer Login
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Erro na Verificação</h1>
              <p className="text-gray-400 mb-6">{error}</p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    Ir para Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Criar Nova Conta
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}