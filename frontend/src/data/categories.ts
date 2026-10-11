export interface SubcategoryGroup {
  title: string;
  items: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: SubcategoryGroup[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'kurta-sets',
    name: 'Kurta Sets',
    slug: 'kurta-sets',
    description: 'Bespoke hand-embroidered and pure cotton kurta sets with dupattas.',
    image: '/images/ethnic_kurta_set_1789624822973.jpg',
    subcategories: [
      {
        title: 'CO-ORD SETS',
        items: ['All Co-ord Sets', '3 Piece Sets', 'Patiala Sets', 'Basic Sets', 'Collar Sets', 'Sleeveless Sets', 'Long Kurta Sets', 'Kaftan Sets']
      },
      {
        title: 'BY STYLE',
        items: ['Anarkali Sets', 'Straight Sets', 'A-Line Sets', 'Sharara Sets']
      },
      {
        title: 'BY FABRIC',
        items: ['Cotton', 'Silk', 'Georgette', 'Chanderi']
      },
      {
        title: 'BY OCCASION',
        items: ['Daily Wear', 'Festive', 'Wedding', 'Office Wear']
      }
    ]
  },
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Timeless handwoven silk, organza, and festive sarees.',
    image: '/images/ethnic_saree_1789624840596.jpg',
    subcategories: [
      {
        title: 'BY FABRIC',
        items: ['Pure Silk', 'Organza', 'Chiffon', 'Georgette', 'Chanderi']
      },
      {
        title: 'BY WEAVE',
        items: ['Banarasi', 'Kanjeevaram', 'Bandhani', 'Chanderi']
      }
    ]
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    slug: 'lehengas',
    description: 'Statement bridal, festive, and bridesmaid lehengas.',
    image: '/images/ethnic_lehenga_1789624855314.jpg',
    subcategories: [
      {
        title: 'BY OCCASION',
        items: ['Bridal', 'Sangeet', 'Mehendi', 'Reception', 'Cocktail']
      }
    ]
  },
  {
    id: 'anarkalis',
    name: 'Anarkalis',
    slug: 'anarkalis',
    description: 'Regal flared Anarkali suits with ornate dupattas.',
    image: '/images/ethnic_anarkali_1789624868513.jpg'
  },
  {
    id: 'palazzo-suits',
    name: 'Palazzo Suits',
    slug: 'palazzo-suits',
    description: 'Effortless breezy palazzo suits for all-day comfort and elegance.',
    image: '/images/ethnic_palazzo_suit_1789624892265.jpg'
  },
  {
    id: 'sharara-sets',
    name: 'Sharara Sets',
    slug: 'sharara-sets',
    description: 'Glamorous tiered sharara sets with intricate embroidery.',
    image: '/images/ethnic_sharara_1789624905126.jpg'
  },
  {
    id: 'indo-western',
    name: 'Indo-Western',
    slug: 'indo-western',
    description: 'Contemporary fusion silhouettes, capes, dhoti sets, and asymmetric cuts.',
    image: '/images/ethnic_fusion_wear_1789624920412.jpg'
  },
  {
    id: 'gowns',
    name: 'Gowns',
    slug: 'gowns',
    description: 'Floor-length ethnic gowns designed for evening soirees.',
    image: '/images/ethnic_gown_1789624931377.jpg'
  },
  {
    id: 'dupattas',
    name: 'Dupattas',
    slug: 'dupattas',
    description: 'Artisanal Banarasi, Phulkari, and Kalamkari statement dupattas.',
    image: '/images/generated_saree_2.svg'
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Our freshest seasonal drops and freshly curated styles.',
    image: '/images/silk_kurta_1789621596703.jpg'
  },
  {
    id: 'bestsellers',
    name: 'Bestsellers',
    slug: 'bestsellers',
    description: 'Customer favorite designs loved for craftsmanship and fit.',
    image: '/images/coord_set_1789621584844.jpg'
  },
  {
    id: 'sale',
    name: 'Sale',
    slug: 'sale',
    description: 'Exclusive seasonal discounts on premier ethnic styles.',
    image: '/images/indowestern_dress_1_1789625141642.jpg'
  },
  {
    id: 'buy-3-at-2699',
    name: 'Buy Any 3 @2699/-',
    slug: 'buy-3-at-2699',
    description: 'Special bundle curation: Choose any 3 essentials for ₹2,699 only.',
    image: '/images/floral_nightwear_1789621619671.jpg'
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  const normalized = slug.toLowerCase().trim();
  return CATEGORIES.find(c => c.slug === normalized || c.slug.replace(/-/g, '') === normalized.replace(/-/g, ''));
}
