import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { useToast } from '@/components/ui/toast';
import { client, getCryptoPaymentUrl, getSessionUrl } from '@/lib/api';
import { formatDate, truncateAddress } from '@/lib/utils';
import { ArrowLeft, MapPin, Bitcoin, Tag, Calendar, MessageCircle, Loader2, ExternalLink, Send, Copy, Check } from 'lucide-react';

interface Listing {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  price: number;
  crypto_type: string;
  tags: string;
  created_at: string;
}

interface Profile {
  anonimax_id: string;
  session_id: string;
  crypto_address: string;
  crypto_type: string;
  city: string;
  bio: string;
}

export function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (id) {
      loadListing();
    }
  }, [id]);

  const loadListing = async () => {
    try {
      // Get listing
      const listingResponse = await client.entities.listings.get({ id: id! });
      const listingData = listingResponse.data;
      setListing(listingData);

      // Get owner profile
      if (listingData?.user_id) {
        try {
          const profileResponse = await client.entities.profiles.queryAll({
            query: { user_id: listingData.user_id },
            limit: 1,
          });
          if (profileResponse.data.items && profileResponse.data.items.length > 0) {
            setOwnerProfile(profileResponse.data.items[0]);
          }
        } catch (error) {
          console.error('Error loading owner profile:', error);
        }
      }
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSession = () => {
    if (ownerProfile?.session_id) {
      window.open(getSessionUrl(ownerProfile.session_id), '_blank');
      addToast('Ouverture de Session...', 'info');
    }
  };

  const handlePayCrypto = () => {
    if (ownerProfile?.crypto_address) {
      const cryptoType = listing?.crypto_type || ownerProfile.crypto_type;
      // No amount included - user will enter it manually
      window.location.href = getCryptoPaymentUrl(cryptoType, ownerProfile.crypto_address);
      addToast('Ouverture du portefeuille...', 'info');
    }
  };

  const copyAddress = async () => {
    if (ownerProfile?.crypto_address) {
      await navigator.clipboard.writeText(ownerProfile.crypto_address);
      setCopiedAddress(true);
      addToast('Adresse copiée !', 'success');
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const tags = listing?.tags?.split(',').filter(Boolean) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Annonce non trouvée</h2>
          <p className="text-slate-400 mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/listings')}>
            Voir toutes les annonces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux annonces
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="purple" className="mb-3">
                      {listing.category}
                    </Badge>
                    <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-emerald-400">
                      <Bitcoin className="h-6 w-6" />
                      {listing.price}
                    </div>
                    <div className="text-sm text-slate-400">{listing.crypto_type}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {listing.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.city}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(listing.created_at)}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{listing.description}</p>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Mots-clés</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Contact */}
          <div className="space-y-6">
            {ownerProfile ? (
              <>
                <ProfileCard profile={ownerProfile} showContact={true} showActions={false} />
                
                {/* Action Buttons - Prominent */}
                <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-center">Contacter le vendeur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Discuter Button */}
                    {ownerProfile.session_id && (
                      <Button
                        onClick={handleOpenSession}
                        className="w-full gap-2 h-12 text-base bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 shadow-lg shadow-cyan-500/25"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Discuter sur Session
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Payer Button - Without amount */}
                    {ownerProfile.crypto_address && (
                      <Button
                        onClick={handlePayCrypto}
                        className="w-full gap-2 h-12 text-base bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25"
                      >
                        <Send className="h-5 w-5" />
                        Payer en {listing.crypto_type}
                      </Button>
                    )}

                    {/* Copy Address */}
                    {ownerProfile.crypto_address && (
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-xs text-slate-500 mb-2 text-center">
                          Ou copier l'adresse manuellement :
                        </p>
                        <button
                          onClick={copyAddress}
                          className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <span className="font-mono text-xs text-slate-400 truncate">
                            {truncateAddress(ownerProfile.crypto_address, 10)}
                          </span>
                          {copiedAddress ? (
                            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-500 shrink-0" />
                          )}
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Session Download Link */}
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-slate-500 mb-2">
                      Vous n'avez pas Session ?
                    </p>
                    <a
                      href="https://getsession.org/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
                    >
                      Télécharger Session
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-slate-400">
                    Le vendeur n'a pas encore configuré son profil de contact.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}