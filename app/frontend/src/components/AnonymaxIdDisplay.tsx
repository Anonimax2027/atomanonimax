import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnonymaxIdDisplayProps {
  id: string;
  size?: 'sm' | 'md' | 'lg';
  showCopy?: boolean;
  className?: string;
}

export function AnonymaxIdDisplay({ 
  id, 
  size = 'md', 
  showCopy = true,
  className 
}: AnonymaxIdDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10",
        sizeClasses[size],
        className
      )}
    >
      <span className="font-mono font-semibold text-cyan-400">{id}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Copier l'ID"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}