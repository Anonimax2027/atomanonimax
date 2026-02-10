import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnonymaxIdDisplay } from '@/components/AnonymaxIdDisplay';
import { MapPin, MessageCircle, Wallet, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { truncateAddress } from '@/lib/utils';

interface ProfileCardProps {
  profile: {
    anonimax_id: string;
    session_id: string;
    crypto_address: string;
    crypto_type: string;
    city: string;
    bio: string;
  };
  showContact?: boolean;
}

export function ProfileCard({ profile, showContact = true }: ProfileCardProps) {
  const [copiedSession, setCopiedSession] = useState(false);
  const [copiedCrypto, setCopiedCrypto] = useState(false);

  const copySessionId = async () => {
    await navigator.clipboard.writeText(profile.session_id);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  const copyCryptoAddress = async () => {
    await navigator.clipboard.writeText(profile.crypto_address);
    setCopiedCrypto(true);
    setTimeout(() => setCopiedCrypto(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Profil Anonyme</CardTitle>
          <AnonymaxIdDisplay id={profile.anonimax_id} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.bio && (
          <p className="text-slate-400 text-sm">{profile.bio}</p>
        )}

        {profile.city && (
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="h-4 w-4" />
            <span>{profile.city}</span>
          </div>
        )}

        {showContact && profile.session_id && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                Session ID
              </div>
              <button
                onClick={copySessionId}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {copiedSession ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="font-mono text-xs text-slate-400 break-all">
              {profile.session_id}
            </p>
          </div>
        )}

        {profile.crypto_address && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <Badge variant="success">{profile.crypto_type}</Badge>
              </div>
              <button
                onClick={copyCryptoAddress}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {copiedCrypto ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="font-mono text-xs text-slate-400">
              {truncateAddress(profile.crypto_address, 12)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}