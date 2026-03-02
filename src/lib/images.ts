import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

/**
 * Get all images for a work within a collection, sorted numerically.
 * Images are stored at: public/images/collections/{collectionSlug}/{workSlug}/
 * Named: 0.webp, 1.webp, etc. (0 is the cover)
 */
export function getWorkImages(collectionSlug: string, workSlug: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'collections', collectionSlug, workSlug);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir)
    .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => {
      const na = parseInt(path.basename(a, path.extname(a)), 10);
      const nb = parseInt(path.basename(b, path.extname(b)), 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });

  return files.map(f => `/images/collections/${collectionSlug}/${workSlug}/${f}`);
}

/**
 * Get the cover image (first image / 0.ext) of a work.
 */
export function getWorkCover(collectionSlug: string, workSlug: string): string {
  const images = getWorkImages(collectionSlug, workSlug);
  return images[0] || '';
}

/**
 * Get cover images for a collection — one per work (the first image of each work).
 */
export function getCollectionCovers(collectionSlug: string, workSlugs: string[]): string[] {
  return workSlugs
    .map(ws => getWorkCover(collectionSlug, ws))
    .filter(Boolean);
}

/**
 * Auto-detect work slugs from filesystem by scanning subdirectories.
 * If the collection markdown has no works array, fall back to this.
 */
export function detectWorkSlugs(collectionSlug: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'collections', collectionSlug);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}
