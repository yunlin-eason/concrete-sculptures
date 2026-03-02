import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface CoverPosition {
  x: number;
  y: number;
}

interface CollectionCardProps {
  title: string;
  covers: string[];
  coverPositions?: CoverPosition[];
  href: string;
  base: string;
  worksCount: number;
  location?: string;
  excerpt?: string;
}

export function CollectionCard({
  title,
  covers,
  coverPositions,
  href,
  base,
  worksCount,
  location,
  excerpt,
}: CollectionCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resolveUrl = (src: string) =>
    src.startsWith('/') ? `${base}${src.slice(1)}` : src;

  const handleMouseEnter = useCallback(() => {
    if (covers.length <= 1) return;

    // Immediately advance to next image
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % covers.length);

    // Then continue cycling every 1200ms
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % covers.length);
    }, 1200);
  }, [covers.length]);

  const handleMouseLeave = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentIndex !== 0) {
      setDirection(-1);
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '50%' : '-50%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-50%' : '50%',
      opacity: 0,
    }),
  };

  return (
    <a
      href={href}
      className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-4/3 overflow-hidden bg-muted relative">
        {covers.length > 0 ? (
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={covers[currentIndex]}
              src={resolveUrl(covers[currentIndex])}
              alt={`${title}${covers.length > 1 ? ` ${currentIndex + 1}` : ''}`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `${coverPositions?.[currentIndex]?.x ?? 50}% ${coverPositions?.[currentIndex]?.y ?? 50}%`,
              }}
              loading="lazy"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            暫無圖片
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{worksCount} 件</span>
          {location && (
            <span className="inline-flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              {location}
            </span>
          )}
        </div>
        {excerpt && excerpt !== '待補' && (
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </a>
  );
}
