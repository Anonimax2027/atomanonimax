import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/api';
import { Shield, Menu, X, User, LogOut, Search, Plus } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  user: { id: string } | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    await client.auth.toLogin();
  };

  const handleLogout = async () => {
    await client.auth.logout();
    onLogout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Anoni<span className="text-cyan-400">max</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/listings"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Annonces
            </Link>
            {user && (
              <>
                <Link
                  to="/search"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Rechercher
                </Link>
                <Link
                  to="/listings/new"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Créer
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Mon Profil
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} size="sm">
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col gap-4">
              <Link
                to="/listings"
                className="text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Annonces
              </Link>
              {user && (
                <>
                  <Link
                    to="/search"
                    className="text-slate-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Rechercher
                  </Link>
                  <Link
                    to="/listings/new"
                    className="text-slate-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Créer une annonce
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-slate-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                </>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-slate-400 hover:text-white transition-colors"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Connexion
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}