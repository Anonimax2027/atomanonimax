import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileCard } from '@/components/ProfileCard';
import { useToast } from '@/components/ui/toast';
import { client } from '@/lib/api';
import { Search as SearchIcon, User, Loader2 } from 'lucide-react';

interface SearchProps {
  user: { id: string } | null;
}

interface Profile {
  id: number;
  anonimax_id: string;
  session_id: string;
  crypto_address: string;
  crypto_type: string;
  city: string;
  bio: string;
}

export function Search({ user }: SearchProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Profile | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      addToast('Veuillez entrer un Anonimax ID', 'error');
      return;
    }

    setSearching(true);
    setSearched(true);
    setResult(null);

    try {
      const response = await client.entities.profiles.queryAll({
        query: { anonimax_id: searchTerm.toUpperCase().trim() },
        limit: 1,
      });

      if (response.data.items && response.data.items.length > 0) {
        setResult(response.data.items[0]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      addToast('Erreur lors de la recherche', 'error');
    } finally {
      setSearching(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Rechercher un Profil</h1>
          <p className="text-slate-400">
            Trouvez un utilisateur par son Anonimax ID
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-cyan-400" />
              Recherche par Anonimax ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="ANX-XXXXXX"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="font-mono"
              />
              <Button type="submit" disabled={searching} className="gap-2 shrink-0">
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
                Rechercher
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <div>
            {result ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Résultat</h2>
                <ProfileCard profile={result} showContact={true} />
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Aucun profil trouvé
                  </h3>
                  <p className="text-slate-400">
                    Aucun utilisateur avec l'ID "{searchTerm}" n'a été trouvé.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help */}
        {!searched && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <User className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Comment ça marche ?
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Entrez l'Anonimax ID de la personne que vous recherchez (format: ANX-XXXXXX) 
                pour voir son profil et ses informations de contact.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}