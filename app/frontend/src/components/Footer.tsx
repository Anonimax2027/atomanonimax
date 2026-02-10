import { Shield, MessageCircle, Bitcoin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Anoni<span className="text-cyan-400">max</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              La plateforme d'anonymat complet pour vos conversations via Session 
              et paiements en crypto-monnaies. Votre vie privée, notre priorité.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Fonctionnalités</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                Messagerie Session
              </li>
              <li className="flex items-center gap-2">
                <Bitcoin className="h-4 w-4 text-emerald-400" />
                Paiements Crypto
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                Anonymat Total
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a 
                  href="https://getsession.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Télécharger Session
                </a>
              </li>
              <li>
                <a 
                  href="https://www.getmonero.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  À propos de Monero
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© 2026 Anonimax. Tous droits réservés. Votre anonymat est notre priorité.</p>
        </div>
      </div>
    </footer>
  );
}