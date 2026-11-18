export type FinishId = 'mirror-pt950' | 'satin-pt950' | 'champagne-pt950';

export interface FinishOption {
  id: FinishId;
  name: string;
  shortLabel: string;
  metalNote: string;
  swatchHex: string;
  priceDelta: number;
  inStock: boolean;
  restockNote?: string;
}

export interface DiameterOption {
  id: '14mm' | '18mm';
  label: string;
  outerDiameter: string;
  approxWeight: string;
  priceDelta: number;
  inStock: boolean;
  restockNote?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  aspectClass: string;
}

export interface ComplementaryItem {
  id: string;
  sku: string;
  category: 'Necklaces' | 'Bracelets' | 'Rings' | 'Ear Cuffs';
  name: string;
  metal: string;
  price: number;
  image: string;
  alt: string;
}

export interface CartItem {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export const PRODUCT_DATA = {
  brand: 'Virelle',
  sku: 'EBAL0094',
  variantCode: 'ebal0094-wh-k',
  title: 'Trinity Triumph Platinum Bali Earrings',
  subtitle:
    'Interlocking three-strand sculptural hoops forged in PGI-certified Platinum 950 with bezel-set natural diamond accents.',
  basePrice: 87434,
  currency: '₹',
  purity: 'Platinum 950 (95% Pure)',
  collection: 'Platinum Atelier',
  availability: 'Ready to Ship',
  claspType: 'Precision Hinged Click-Top Snap Lock',
  certification: 'Platinum Guild International (PGI) · BIS Hallmarked',
  gallery: [
    {
      id: 'hero',
      src: 'https://res.cloudinary.com/gps27k9y/image/upload/v1794990624/hero_platinum_bali_1794984555175.jpg',
      alt: 'Trinity Triumph Platinum Bali Earrings resting on dark obsidian stone',
      caption: 'Sculpted three-strand helical weave with micro-bezel diamond accents',
      aspectClass: 'aspect-[4/3]',
    },
    {
      id: 'editorial',
      src: 'https://res.cloudinary.com/gps27k9y/image/upload/v1794990625/editorial_ear_profile_1794984553515.jpg',
      alt: 'Editorial ear profile showing Trinity Triumph Platinum Bali Earrings worn',
      caption: 'Balanced profile engineered for weightless all-day ear drape',
      aspectClass: 'aspect-[3/4]',
    },
    {
      id: 'clasp',
      src: 'https://res.cloudinary.com/gps27k9y/image/upload/v1794990624/1f643e72-8bb2-4464-84de-a6d1b7e795d2.jpg',
      alt: 'Macro view of the hinged click-top snap lock clasp on Platinum 950 bali hoop',
      caption: 'Flush-seated hinged barrel clasp tested for 10,000+ smooth closures',
      aspectClass: 'aspect-[4/3]',
    },
    {
      id: 'tray',
      src: 'https://res.cloudinary.com/gps27k9y/image/upload/v1794990624/lifestyle_velvet_tray_1794984553077.jpg',
      alt: 'Trinity Triumph Platinum Bali Earrings presented on charcoal suede jeweler tray',
      caption: 'Delivered in an heirloom charcoal suede travel vault with PGI certificate',
      aspectClass: 'aspect-[4/3]',
    },
  ] as GalleryImage[],
  finishes: [
    {
      id: 'mirror-pt950',
      name: 'Mirror Platinum 950',
      shortLabel: 'Mirror 950',
      metalNote: 'Hand-burnished high-luster white platinum sheen',
      swatchHex: '#E5E7EC',
      priceDelta: 0,
      inStock: true,
    },
    {
      id: 'satin-pt950',
      name: 'Brushed Satin Platinum',
      shortLabel: 'Brushed Satin',
      metalNote: 'Architectural hairline matte exterior with mirror inner bevels',
      swatchHex: '#A7ADB8',
      priceDelta: 2200,
      inStock: true,
    },
    {
      id: 'champagne-pt950',
      name: 'Champagne Trim Platinum',
      shortLabel: 'Champagne Trim',
      metalNote: 'Platinum 950 strands paired with an 18K warm champagne center fillet',
      swatchHex: '#D6C7AE',
      priceDelta: 5400,
      inStock: false,
      restockNote: 'Next batch Nov 28',
    },
  ] as FinishOption[],
  diameters: [
    {
      id: '14mm',
      label: '14 mm Classic',
      outerDiameter: '14.0 mm',
      approxWeight: '6.42 g',
      priceDelta: 0,
      inStock: true,
    },
    {
      id: '18mm',
      label: '18 mm Statement',
      outerDiameter: '18.0 mm',
      approxWeight: '7.85 g',
      priceDelta: 9366,
      inStock: true,
    },
  ] as DiameterOption[],
  specs: [
    { label: 'Product Code', value: 'EBAL0094 (ebal0094-wh-k)' },
    { label: 'Precious Metal', value: 'Platinum 950 (95.0% Purity)' },
    { label: 'Silhouette', value: 'Trinity Interlocking Bali Hoop' },
    { label: 'Accent Stones', value: '0.12 ct Total · EF-VVS Natural Diamonds' },
    { label: 'Locking Mechanism', value: 'Hinged Click-Top Snap Clasp' },
    { label: 'Allergen Profile', value: '100% Nickel-Free & Hypoallergenic' },
    { label: 'Hallmark & Assay', value: 'PGI Verified · BIS & Laser Stamped Pt 950' },
    { label: 'Atelier Origin', value: 'Hand-assembled in Mumbai, India' },
  ],
  marqueeItems: [
    'Platinum 950 Certified',
    'SKU EBAL0094',
    'Natural EF-VVS Diamonds',
    'Insured Vault Courier',
    '30-Day Complimentary Returns',
    'Lifetime Atelier Repolish',
    'Hypoallergenic Pure White Sheen',
  ],
  complementaryItems: [
    {
      id: 'look-necklace',
      sku: 'PNEC0142',
      category: 'Necklaces',
      name: 'Sovereign Platinum Link Collar Necklace',
      metal: 'Platinum 950 · 0.45 ct Diamonds',
      price: 248500,
      image:
        'https://res.cloudinary.com/gps27k9y/image/upload/v1794990624/a61b18f0-336c-4051-8618-628c51c629b5.jpg',
      alt: 'Sovereign Platinum Link Collar Necklace on dark obsidian',
    },
    {
      id: 'look-bracelet',
      sku: 'PBRC0088',
      category: 'Bracelets',
      name: 'Trinity Twisted Platinum Cuff Bracelet',
      metal: 'Platinum 950 · Hand-Forged',
      price: 134900,
      image:
        'https://res.cloudinary.com/gps27k9y/image/upload/v1794990625/3cbb8982-ccb8-48cc-ac5f-7c121304cc84.jpg',
      alt: 'Trinity Twisted Platinum Cuff Bracelet on dark slate stone',
    },
    {
      id: 'look-ring',
      sku: 'PRNG0219',
      category: 'Rings',
      name: 'Solstice Interlocking Platinum Band Ring',
      metal: 'Platinum 950 · Pavé Diamond Bar',
      price: 72600,
      image:
        'https://res.cloudinary.com/gps27k9y/image/upload/v1794990624/83c23e95-80f3-46e0-8768-beae177c13f2.jpg',
      alt: 'Solstice Interlocking Platinum Band Ring on basalt stone',
    },
    {
      id: 'look-earcuff',
      sku: 'PECF0051',
      category: 'Ear Cuffs',
      name: 'Celeste Double-Arc Platinum Ear Cuff',
      metal: 'Platinum 950 · Mirror Polish',
      price: 38400,
      image:
        'https://res.cloudinary.com/gps27k9y/image/upload/v1794990624/a618b973-fa89-47df-a2dc-5975c5ffefc3.jpg',
      alt: 'Celeste Double-Arc Platinum Ear Cuff on obsidian slab',
    },
  ] as ComplementaryItem[],
};

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
