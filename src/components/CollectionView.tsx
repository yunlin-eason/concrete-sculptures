import { useState, useEffect } from 'react';
import { ImageGallery } from './ImageGallery';

interface WorkData {
  slug: string;
  title: string;
  description: string;
  images: string[];
  cover: string;
  locationUrl?: string;
}

interface CollectionViewProps {
  collectionSlug: string;
  collectionTitle: string;
  collectionLocation?: string;
  collectionLocationUrl?: string;
  works: WorkData[];
  base: string;
  initialWorkSlug?: string;
}

export function CollectionView({
  collectionSlug,
  collectionTitle,
  collectionLocation,
  collectionLocationUrl,
  works,
  base,
  initialWorkSlug,
}: CollectionViewProps) {
  const isSingleWork = works.length <= 1;
  const [activeSlug, setActiveSlug] = useState(
    initialWorkSlug || works[0]?.slug || ''
  );
  const pieces = works.length;
  const activeWork = works.find((w) => w.slug === activeSlug) || works[0];

  const resolveUrl = (src: string) =>
    src.startsWith('/') ? `${base}${src.slice(1)}` : src;

  // Preload all images from all works on mount
  useEffect(() => {
    works.forEach((work) => {
      work.images.forEach((img) => {
        const el = new Image();
        el.src = resolveUrl(img);
      });
    });
  }, [works, base]);

  // Update URL without page reload when switching works
  useEffect(() => {
    if (isSingleWork) return;
    const newUrl = `${base}collections/${collectionSlug}/${activeSlug}/`;
    if (window.location.pathname !== newUrl) {
      window.history.pushState({}, '', newUrl);
    }
  }, [activeSlug, collectionSlug, base, isSingleWork]);

  // Handle browser back/forward
  useEffect(() => {
    if (isSingleWork) return;
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/\/collections\/[^/]+\/([^/]+)\/?$/);
      if (match && match[1]) {
        const found = works.find((w) => w.slug === match[1]);
        if (found) setActiveSlug(found.slug);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [works, isSingleWork]);

  if (!activeWork) return null;

  // Work locationUrl overrides collection locationUrl; location always from collection
  const effectiveLocation = collectionLocation || '';
  const effectiveLocationUrl = activeWork.locationUrl || collectionLocationUrl || '';

  return (
    <div>
      {/* Image Gallery */}
      <div className="mb-8">
        <ImageGallery
          images={activeWork.images}
          base={base}
          alt={activeWork.title || collectionTitle}
        />
      </div>

      {/* Work location info (if different from collection-level shown in header) */}
      {!isSingleWork && effectiveLocation && (
        <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
          {effectiveLocationUrl && effectiveLocationUrl.startsWith('http') ? (
            <a
              href={effectiveLocationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              {effectiveLocation}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              {effectiveLocation}
            </span>
          )}
        </div>
      )}

      {/* Work Selector — only for multi-work collections */}
      {!isSingleWork && (
        <div className="mb-8">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {works.map((work) => (
              <button
                key={work.slug}
                onClick={() => setActiveSlug(work.slug)}
                className={`group flex items-center gap-3 rounded-lg border p-2 text-left transition-all hover:shadow-sm ${work.slug === activeSlug
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                {work.cover && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={resolveUrl(work.cover)}
                      alt={work.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <span
                  className={`text-sm font-medium transition-colors ${work.slug === activeSlug
                      ? 'text-primary'
                      : 'group-hover:text-primary'
                    }`}
                >
                  {work.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Work Description */}
      {activeWork.description && activeWork.description !== '待補' && (
        <div className="prose prose-neutral max-w-none">
          <p>{activeWork.description}</p>
        </div>
      )}
    </div>
  );
}
