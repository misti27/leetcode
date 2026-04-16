import React, { useEffect, useState } from 'react';
import { isImageRef, loadImageBlob } from '../services/imageStorage';

interface ImageBlockImageProps {
  content: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

export const ImageBlockImage: React.FC<ImageBlockImageProps> = ({
  content,
  alt,
  className,
  style,
  fallbackSrc,
}) => {
  const [resolvedSrc, setResolvedSrc] = useState(content || fallbackSrc || '');

  useEffect(() => {
    let revokedUrl: string | null = null;
    let cancelled = false;

    if (!content) {
      setResolvedSrc(fallbackSrc || '');
      return () => {};
    }

    if (!isImageRef(content)) {
      setResolvedSrc(content);
      return () => {};
    }

    loadImageBlob(content)
      .then((blob) => {
        if (cancelled) return;

        if (!blob) {
          setResolvedSrc(fallbackSrc || '');
          return;
        }

        revokedUrl = URL.createObjectURL(blob);
        setResolvedSrc(revokedUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedSrc(fallbackSrc || '');
        }
      });

    return () => {
      cancelled = true;
      if (revokedUrl) {
        URL.revokeObjectURL(revokedUrl);
      }
    };
  }, [content, fallbackSrc]);

  return (
    <img
      src={resolvedSrc || fallbackSrc || ''}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        if (fallbackSrc) {
          (e.target as HTMLImageElement).src = fallbackSrc;
        }
      }}
    />
  );
};
