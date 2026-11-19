import { useState } from 'react';
import { Factory } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 border border-slate-200 p-6 text-center ${className}`}
      >
        <Factory className="w-8 h-8 text-slate-400 mb-3" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-700">{fallbackTitle}</p>
        {fallbackSubtitle && (
          <p className="text-xs text-slate-500 mt-1 max-w-xs">{fallbackSubtitle}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
