import React from 'react';
import { getCachedProductCatalog, getCachedReviews } from '@/src/lib/catalog';
import { ProductShowcaseClient } from '@/src/components/ProductShowcaseClient';

export const revalidate = 300;

export default async function HomePage() {
  const [{ product, defaultEstimate }, reviews] = await Promise.all([
    getCachedProductCatalog(),
    getCachedReviews(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    description: product.subtitle,
    material: product.purity,
    image: product.gallery.map((g) => g.src),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.basePrice,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.91',
      reviewCount: String(136 + reviews.length),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ProductShowcaseClient
        initialProduct={product}
        initialReviews={reviews}
        initialDeliveryEstimate={defaultEstimate}
      />
    </>
  );
}
