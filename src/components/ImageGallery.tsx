import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  base: string;
  alt: string;
}

type LoadState = 'loading' | 'loaded' | 'error';

export function ImageGallery({
  images,
  base,
  alt,
}: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadStates, setLoadStates] = useState<Record<string, LoadState>>({});
  const [transitioning, setTransitioning] = useState(false);
  const resolveUrl = (src: string) =>
    src.startsWith('/') ? `${base}${src.slice(1)}` : src;

  useEffect(() => {
    if (!images.length) return;

    const initial: Record<string, LoadState> = {};
    images.forEach((img) => {
      initial[img] = 'loading';
    });
    setLoadStates(initial);

    images.forEach((img) => {
      const el = new Image();
      el.src = resolveUrl(img);
      el.onload = () =>
        setLoadStates((prev) => ({ ...prev, [img]: 'loaded' }));
      el.onerror = () =>
        setLoadStates((prev) => ({ ...prev, [img]: 'error' }));
    });
  }, [images, base]);

  useEffect(() => {
    setTransitioning(true);
    setCurrent(0);
    setDirection(0);
    // 下一個 frame 再恢復，讓這次的位置重置不帶動畫
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitioning(false));
    });
  }, [images]);

  // 修改 1：不循環，到頭就停
  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => Math.min(c + 1, images.length - 1));
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        暫無圖片
      </div>
    );
  }

  const img = images[current];
  const isLoaded = loadStates[img] === 'loaded';

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full select-none">
      <div className="group relative w-full aspect-4/3 max-h-150 overflow-hidden rounded-xl">

        <div key={images.join(',')} className="relative w-full aspect-4/3 max-h-150 overflow-hidden rounded-xl">
          {images.map((imgSrc, i) => {
            const isActive = i === current;
            const isPrev = i === current - direction; // 用來決定退出方向（可選）
            return (
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.img
                  key={imgSrc}
                  src={resolveUrl(imgSrc)}
                  alt={`${alt} - ${i + 1}`}
                  initial={false}
                  animate={{
                    x: i < current ? '-25%' : i > current ? '25%' : '0%',
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="max-h-full max-w-full object-contain"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in',
                  }}
                />
              </div>
            );
          })}
        </div>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-8 w-8 animate-spin text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}

        {images.length > 1 && (
          <>
            {/* 修改 1：第一張時禁用 prev 按鈕 */}
            <button
              onClick={prev}
              disabled={current === 0}
              className="
                absolute left-3 top-1/2 z-10 -translate-y-1/2
                flex h-10 w-10 items-center justify-center
                rounded-full bg-black/40 text-white backdrop-blur-sm
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                hover:bg-black/65
                disabled:opacity-0 disabled:pointer-events-none
              "
              aria-label="上一張"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* 修改 1：最後一張時禁用 next 按鈕 */}
            <button
              onClick={next}
              disabled={current === images.length - 1}
              className="
                absolute right-3 top-1/2 z-10 -translate-y-1/2
                flex h-10 w-10 items-center justify-center
                rounded-full bg-black/40 text-white backdrop-blur-sm
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                hover:bg-black/65
                disabled:opacity-0 disabled:pointer-events-none
              "
              aria-label="下一張"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* 圓點指示器：放在圖片下方 */}
      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`跳至第 ${i + 1} 張`}
              className="rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width: i === current ? '10px' : '8px',
                height: i === current ? '10px' : '8px',
                backgroundColor: i === current ? 'var(--primary)' : 'oklch(from var(--muted-foreground) l c h / 0.4)',
                boxShadow: i === current
                  ? '0 0 0 2px var(--background), 0 0 8px 1px (var(--foreground))'
                  : 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}