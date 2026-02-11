import { Link } from 'react-router-dom';
import { Shield, MessageCircle, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Anonimax
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md">
              Plataforma de anonimato completo para conversas via Session e pagamentos em criptomoedas. 
              Sua privacidade é nossa prioridade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Anúncios
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Buscar Perfis
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link to="/guide/brz" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Comprar BRZ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/guide/session" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Guia Session
                </Link>
              </li>
              <li>
                <a 
                  href="https://getsession.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  Session App
                </a>
              </li>
              <li>
                <a 
                  href="https://chainless.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Chainless App
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Anonimax. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}