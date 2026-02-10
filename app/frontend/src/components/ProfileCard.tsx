import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnonymaxIdDisplay } from '@/components/AnonymaxIdDisplay';
import { MapPin, MessageCircle, Wallet, Copy, Check, ExternalLink, Send } from 'lucide-react';
import { useState } from 'react';
import { truncateAddress } from '@/lib/utils';
import { getCryptoPaymentUrl, getSessionUrl } from '@/lib/api';

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
  showActions?: boolean;
}

export function ProfileCard({ profile, showContact = true, showActions = true }: ProfileCardProps) {
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

  const handleOpenSession = () => {
    if (profile.session_id) {
      window.open(getSessionUrl(profile.session_id), '_blank');
    }
  };

  const handlePayCrypto = () => {
    if (profile.crypto_address && profile.crypto_type) {
      window.location.href = getCryptoPaymentUrl(profile.crypto_type, profile.crypto_address);
    }
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
                title="Copier l'ID Session"
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
                title="Copier l'adresse"
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

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-3 pt-2">
            {profile.session_id && (
              <Button
                onClick={handleOpenSession}
                className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500"
              >
                <MessageCircle className="h-4 w-4" />
                Discuter
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            {profile.crypto_address && (
              <Button
                onClick={handlePayCrypto}
                variant="outline"
                className="flex-1 gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <Send className="h-4 w-4" />
                Payer
                <Badge variant="success" className="ml-1 text-xs">
                  {profile.crypto_type}
                </Badge>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}