import { PRODUCT_DATA } from '@/src/data/product';

export type ProductCatalog = typeof PRODUCT_DATA;

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format?: string;
}

function buildDeliveryUrl(
  cloudName: string,
  folder: string,
  localPath: string
): string {
  const filenameWithExt = localPath.split('/').pop() || '';
  const publicId = filenameWithExt.replace(/\.[^/.]+$/, '');
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
  const assetPath = cleanFolder ? `${cleanFolder}/${publicId}` : publicId;
  return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload/f_auto,q_auto/${assetPath}`;
}

function matchResourceUrl(
  resources: CloudinaryResource[],
  localPath: string
): string | null {
  const filename = (localPath.split('/').pop() || '').replace(/\.[^/.]+$/, '').toLowerCase();
  // Match full filename (e.g. hero_platinum_bali_1794984555175) or base prefix (hero_platinum_bali)
  const baseSlug = filename.replace(/_\d+$/, '');

  const exact = resources.find((r) => {
    const idLower = r.public_id.toLowerCase();
    return idLower === filename || idLower.endsWith(`/${filename}`);
  });
  if (exact) return exact.secure_url;

  const bySlug = resources.find((r) => r.public_id.toLowerCase().includes(baseSlug));
  return bySlug ? bySlug.secure_url : null;
}

async function fetchCloudinaryResources(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  folder: string
): Promise<CloudinaryResource[]> {
  try {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const baseUrl = cleanFolder
      ? `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/image/upload?prefix=${encodeURIComponent(cleanFolder)}&max_results=50`
      : `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/image/upload?max_results=50`;

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const res = await fetch(baseUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as { resources?: CloudinaryResource[] };
    return Array.isArray(json.resources) ? json.resources : [];
  } catch {
    return [];
  }
}

export async function resolveProductWithCloudinary(
  baseProduct: ProductCatalog
): Promise<ProductCatalog> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) {
    return baseProduct;
  }

  const folder = process.env.CLOUDINARY_FOLDER?.trim() || '';
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  const resources =
    apiKey && apiSecret
      ? await fetchCloudinaryResources(cloudName, apiKey, apiSecret, folder)
      : [];

  const resolveUrl = (localPath: string): string => {
    if (resources.length > 0) {
      const matched = matchResourceUrl(resources, localPath);
      if (matched) return matched;
    }
    return buildDeliveryUrl(cloudName, folder, localPath);
  };

  return {
    ...baseProduct,
    gallery: baseProduct.gallery.map((item) => ({
      ...item,
      src: resolveUrl(item.src),
    })),
    complementaryItems: baseProduct.complementaryItems.map((item) => ({
      ...item,
      image: resolveUrl(item.image),
    })),
  };
}
