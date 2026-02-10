import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Bitcoin } from 'lucide-react';

interface ListingCardProps {
  listing: {
    id: number;
    title: string;
    description: string;
    category: string;
    city: string;
    price: number;
    crypto_type: string;
    tags: string;
    created_at: string;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const tags = listing.tags?.split(',').filter(Boolean).slice(0, 3) || [];

  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="h-full hover:border-cyan-500/50 hover:-translate-y-1 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
            <Badge variant="purple" className="shrink-0">
              {listing.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="h-4 w-4" />
              {listing.city}
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Bitcoin className="h-4 w-4" />
              {listing.price} {listing.crypto_type}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}