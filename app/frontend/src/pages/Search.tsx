import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { client } from '@/lib/api';
import { ProfileCard } from '@/components/ProfileCard';
import { Loader2, Search as SearchIcon, User, AlertCircle } from 'lucide-react';

interface Profile {
  id: number;
  user_id: string;
  anonymax_id: string;
  session_id?: string;
  crypto_address?: string;
  crypto_type?: string;
  description?: string;
}

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Profile[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    setSearching(true);
    setSearched(true);
    
    try {
      // Buscar por Anonimax ID
      const response = await client.entities.profiles.queryAll({
        query: {},
      });
      
      const profiles = response.data.items || [];
      
      // Filtrar por ID ou descrição
      const filtered = profiles.filter((p: Profile) => 
        p.anonymax_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 mb-6">
            <SearchIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Buscar Perfis
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Encontre usuários pelo Anonimax ID ou palavras-chave
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Digite o Anonimax ID (ex: ANX-ABC123) ou palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" size="lg" disabled={searching} className="gap-2">
                {searching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SearchIcon className="h-5 w-5" />
                )}
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              {results.length} resultado(s) encontrado(s)
            </h2>

            {results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">
                    Nenhum perfil encontrado
                  </h3>
                  <p className="text-slate-500">
                    Verifique o ID digitado ou tente outras palavras-chave
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {results.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {!searched && (
          <Card>
            <CardHeader>
              <CardTitle>Dicas de Busca</CardTitle>
              <CardDescription>
                Como encontrar perfis no Anonimax
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Digite o <strong className="text-white">Anonimax ID completo</strong> (ex: ANX-ABC123) para encontrar um usuário específico</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Use <strong className="text-white">palavras-chave</strong> para buscar na descrição dos perfis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Os resultados mostram apenas perfis <strong className="text-white">públicos e ativos</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}