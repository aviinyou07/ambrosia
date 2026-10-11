export interface Product {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  images: string[];
  sizes: string[];
  inStock: boolean;
  tag?: 'New arrival' | 'Bestseller' | 'Trending' | 'Sale';
  description: string;
  materialAndCare: string;
  shippingAndReturns: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  style?: string;
  fabric?: string;
  color?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Floral Block Print Cotton Kurta Set',
    slug: 'floral-block-print-cotton-kurta-set',
    categorySlug: 'kurta-sets',
    categoryName: 'Kurta Sets',
    price: 2699,
    originalPrice: 4499,
    discountPercentage: 40,
    images: [
      '/images/ethnic_kurta_set_1789624822973.jpg',
      '/images/generated_kurta_1.svg',
      '/images/generated_kurta_2.svg',
      '/images/generated_kurta_3.svg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    tag: 'Bestseller',
    description: 'Elegant floral block print kurta set crafted in premium breathable cotton. The set includes a straight fit kurta with delicate zari embroidery on the neckline, paired with comfortable matching trousers and a lightweight mulmul dupatta.',
    materialAndCare: '100% Pure Cambric Cotton. Gentle machine wash cold or hand wash separately. Dry in shade. Warm iron.',
    shippingAndReturns: 'Dispatches within 24-48 hours. Free delivery on orders above ₹2000. Easy 7-day hassle-free returns.',
    rating: 4.8,
    reviewsCount: 142,
    featured: true,
    style: 'Straight Sets',
    fabric: 'Cotton',
    color: 'Ivory / Pink'
  },
  {
    id: 'prod-2',
    title: 'Pastel Organza Silk Saree with Zari Border',
    slug: 'pastel-organza-silk-saree',
    categorySlug: 'sarees',
    categoryName: 'Sarees',
    price: 3499,
    originalPrice: 5999,
    discountPercentage: 42,
    images: [
      '/images/ethnic_saree_1789624840596.jpg',
      '/images/generated_saree_1.svg',
      '/images/generated_saree_2.svg',
      '/images/generated_saree_3.svg',
    ],
    sizes: ['Free Size'],
    inStock: true,
    tag: 'Trending',
    description: 'Breathtaking pastel pink organza silk saree adorned with scalloped hand-cut zari embroidery borders. Comes with an unstitched heavy brocade blouse fabric.',
    materialAndCare: 'Pure Organza Silk. Dry clean only. Store wrapped in muslin cloth.',
    shippingAndReturns: 'Ships in 1-2 business days. Express domestic shipping included. Return within 7 days.',
    rating: 4.9,
    reviewsCount: 98,
    featured: true,
    style: 'Classic Saree',
    fabric: 'Silk',
    color: 'Pastel Pink'
  },
  {
    id: 'prod-3',
    title: 'Heritage Embroidered Silk Lehenga Set',
    slug: 'heritage-embroidered-silk-lehenga-set',
    categorySlug: 'lehengas',
    categoryName: 'Lehengas',
    price: 4999,
    originalPrice: 8999,
    discountPercentage: 44,
    images: [
      '/images/ethnic_lehenga_1789624855314.jpg',
      '/images/generated_lehenga_1.svg',
      '/images/generated_lehenga_2.svg',
      '/images/generated_lehenga_3.svg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tag: 'New arrival',
    description: 'An exquisite festive lehenga crafted in art silk, featuring intricate sequins, thread embroidery, and a voluminous kali flare. Paired with an embellished choli and soft net dupatta.',
    materialAndCare: 'Art Silk with Butter Crepe lining. Dry clean only.',
    shippingAndReturns: 'Express dispatched within 2 business days. 7-day replacement guarantee.',
    rating: 5.0,
    reviewsCount: 64,
    featured: true,
    style: 'Bridal & Festive',
    fabric: 'Silk',
    color: 'Crimson Wine'
  },
  {
    id: 'prod-4',
    title: 'Georgette Flared Anarkali Suit with Dupatta',
    slug: 'georgette-flared-anarkali-suit',
    categorySlug: 'anarkalis',
    categoryName: 'Anarkalis',
    price: 2899,
    originalPrice: 4800,
    discountPercentage: 40,
    images: [
      '/images/ethnic_anarkali_1789624868513.jpg',
      '/images/generated_anarkali_1.svg',
      '/images/generated_anarkali_2.svg',
      '/images/generated_anarkali_3.svg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    tag: 'Bestseller',
    description: 'Stunning floor-touch Anarkali suit with 32-kali flare, intricate gota patti neckline work, and a lightweight digital-printed dupatta.',
    materialAndCare: 'Premium Faux Georgette with micro-cotton lining. Hand wash cold.',
    shippingAndReturns: 'Delivered in 3-5 business days across India.',
    rating: 4.7,
    reviewsCount: 89,
    featured: true,
    style: 'Anarkali Sets',
    fabric: 'Georgette',
    color: 'Teal'
  },
  {
    id: 'prod-5',
    title: 'Chic Embroidered Palazzo Suit Set',
    slug: 'chic-embroidered-palazzo-suit-set',
    categorySlug: 'palazzo-suits',
    categoryName: 'Palazzo Suits',
    price: 2199,
    originalPrice: 3500,
    discountPercentage: 37,
    images: [
      '/images/ethnic_palazzo_suit_1789624892265.jpg',
      '/images/generated_palazzo_1.svg',
      '/images/generated_palazzo_2.svg',
      '/images/generated_palazzo_3.svg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    tag: 'Sale',
    description: 'Easy-breezy palazzo suit featuring a straight cotton-slub kurta paired with wide-leg flounce palazzos and a matching stole.',
    materialAndCare: '100% Breathable Cotton Slub. Gentle cycle wash.',
    shippingAndReturns: 'Free standard shipping. Return or exchange within 7 days.',
    rating: 4.6,
    reviewsCount: 112,
    featured: false,
    style: 'Palazzo Sets',
    fabric: 'Cotton',
    color: 'Mustard'
  },
  {
    id: 'prod-6',
    title: 'Festive Tiered Embellished Sharara Set',
    slug: 'festive-tiered-embellished-sharara-set',
    categorySlug: 'sharara-sets',
    categoryName: 'Sharara Sets',
    price: 2999,
    originalPrice: 4999,
    discountPercentage: 40,
    images: [
      '/images/ethnic_sharara_1789624905126.jpg',
      '/images/generated_sharara_1.svg',
      '/images/generated_sharara_2.svg',
      '/images/generated_sharara_3.svg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tag: 'Trending',
    description: 'Intricately embroidered short peplum kurta paired with flared multi-tier sharara bottoms and gold foil printed dupatta.',
    materialAndCare: 'Chanderi Silk blend. Dry clean recommended.',
    shippingAndReturns: 'Dispatches in 24 hours. Express shipping available.',
    rating: 4.9,
    reviewsCount: 76,
    featured: false,
    style: 'Sharara Sets',
    fabric: 'Chanderi',
    color: 'Mint Sage'
  },
  {
    id: 'prod-7',
    title: 'Modern Asymmetric Indo-Western Fusion Dress',
    slug: 'modern-indo-western-fusion-dress',
    categorySlug: 'indo-western',
    categoryName: 'Indo-Western',
    price: 2499,
    originalPrice: 3999,
    discountPercentage: 38,
    images: [
      '/images/ethnic_fusion_wear_1789624920412.jpg',
      '/images/indowestern_dress_1_1789625141642.jpg',
      '/images/generated_fusion_1.svg',
      '/images/generated_fusion_2.svg',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    tag: 'New arrival',
    description: 'Contemporary fusion piece with high-low asymmetric hemline, embroidered waist belt, and tailored cowl bottoms.',
    materialAndCare: 'Crepe Silk. Dry clean or gentle hand wash.',
    shippingAndReturns: 'Fast 2-4 day domestic shipping.',
    rating: 4.8,
    reviewsCount: 52,
    featured: true,
    style: 'Fusion Dress',
    fabric: 'Silk Blend',
    color: 'Emerald Green'
  },
  {
    id: 'prod-8',
    title: 'Royal Floor-Length Ethnic Gown',
    slug: 'royal-floor-length-ethnic-gown',
    categorySlug: 'gowns',
    categoryName: 'Gowns',
    price: 3199,
    originalPrice: 5500,
    discountPercentage: 42,
    images: [
      '/images/ethnic_gown_1789624931377.jpg',
      '/images/generated_gown_1.svg',
      '/images/generated_gown_2.svg',
      '/images/generated_gown_3.svg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tag: 'Bestseller',
    description: 'Floor-sweeping evening gown in art raw silk with hand-worked dabka and pearl embellishments on the yoke and sheer cape sleeves.',
    materialAndCare: 'Art Raw Silk. Professional dry clean only.',
    shippingAndReturns: 'Dispatched with premium garment bag packaging.',
    rating: 4.9,
    reviewsCount: 68,
    featured: true,
    style: 'Evening Gowns',
    fabric: 'Raw Silk',
    color: 'Midnight Navy'
  },
  {
    id: 'prod-9',
    title: 'Simple Everyday Cotton Kurti',
    slug: 'simple-everyday-cotton-kurti',
    categorySlug: 'kurta-sets',
    categoryName: 'Kurta Sets',
    price: 999,
    originalPrice: 1900,
    discountPercentage: 47,
    images: [
      '/images/silk_kurta_1789621596703.jpg',
      '/images/generated_kurta_4.svg',
      '/images/generated_kurta_5.svg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    tag: 'New arrival',
    description: 'Lightweight everyday cotton kurti tailored with side slits, wooden button detailing, and breathable comfort for daily workwear.',
    materialAndCare: '100% Pure Cotton. Regular machine wash.',
    shippingAndReturns: 'Standard delivery in 3-5 business days.',
    rating: 4.5,
    reviewsCount: 210,
    featured: true,
    style: 'Daily Wear',
    fabric: 'Cotton',
    color: 'Butter Yellow'
  },
  {
    id: 'prod-10',
    title: 'Vibrant Punjabi Salwar Suit Set',
    slug: 'vibrant-punjabi-salwar-suit-set',
    categorySlug: 'kurta-sets',
    categoryName: 'Kurta Sets',
    price: 1699,
    originalPrice: 2800,
    discountPercentage: 39,
    images: [
      '/images/coord_set_1789621584844.jpg',
      '/images/generated_kurta_6.svg',
      '/images/generated_kurta_7.svg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    tag: 'Bestseller',
    description: 'Traditional Punjabi patiala salwar suit with phulkari thread embroidery and flowy pleated bottoms.',
    materialAndCare: 'Glaze Cotton with santoon lining. Hand wash.',
    shippingAndReturns: 'Free shipping on prepaid orders.',
    rating: 4.7,
    reviewsCount: 130,
    featured: true,
    style: 'Patiala Sets',
    fabric: 'Cotton',
    color: 'Fuschia'
  },
  {
    id: 'prod-11',
    title: 'Casual Printed Cotton Suit with Dupatta',
    slug: 'casual-printed-cotton-suit-with-dupatta',
    categorySlug: 'kurta-sets',
    categoryName: 'Kurta Sets',
    price: 1499,
    originalPrice: 2200,
    discountPercentage: 32,
    images: [
      '/images/floral_nightwear_1789621619671.jpg',
      '/images/generated_kurta_8.svg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tag: 'Sale',
    description: 'Breezy Jaipur hand-block printed kurti with straight pants and matching kotadori dupatta.',
    materialAndCare: '100% Jaipur Cotton. Hand wash separately.',
    shippingAndReturns: 'Dispatched within 24 hours.',
    rating: 4.6,
    reviewsCount: 88,
    featured: true,
    style: 'Daily Wear',
    fabric: 'Cotton',
    color: 'Indigo Blue'
  },
  {
    id: 'prod-12',
    title: 'Artisanal Banarasi Woven Silk Dupatta',
    slug: 'artisanal-banarasi-woven-silk-dupatta',
    categorySlug: 'dupattas',
    categoryName: 'Dupattas',
    price: 999,
    originalPrice: 1800,
    discountPercentage: 44,
    images: [
      '/images/generated_saree_4.svg',
      '/images/generated_saree_5.svg',
    ],
    sizes: ['Free Size (2.5m)'],
    inStock: true,
    tag: 'Sale',
    description: 'Handcrafted Banarasi zari woven dupatta featuring floral jaal patterns and golden tassels.',
    materialAndCare: 'Chanderi Silk. Dry clean only.',
    shippingAndReturns: 'Dispatched within 2 business days.',
    rating: 4.8,
    reviewsCount: 45,
    featured: false,
    style: 'Dupattas',
    fabric: 'Silk',
    color: 'Gold / Crimson'
  }
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  const normalized = slug.toLowerCase().trim();
  return PRODUCTS.find(p => p.slug === normalized);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const normalized = categorySlug.toLowerCase().trim();
  if (normalized === 'all') return PRODUCTS;
  if (normalized === 'new-arrivals') return PRODUCTS.filter(p => p.tag === 'New arrival');
  if (normalized === 'bestsellers') return PRODUCTS.filter(p => p.tag === 'Bestseller');
  if (normalized === 'sale') return PRODUCTS.filter(p => p.tag === 'Sale' || p.discountPercentage >= 40);
  if (normalized === 'buy-3-at-2699') return PRODUCTS.filter(p => p.price <= 1800);

  return PRODUCTS.filter(p => 
    p.categorySlug === normalized ||
    p.categorySlug.replace(/-/g, '') === normalized.replace(/-/g, '')
  );
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured);
}

export function getProductsByMaxPrice(maxPrice: number): Product[] {
  return PRODUCTS.filter(p => p.price <= maxPrice);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.categoryName.toLowerCase().includes(q) ||
    p.categorySlug.toLowerCase().includes(q) ||
    (p.fabric && p.fabric.toLowerCase().includes(q)) ||
    (p.style && p.style.toLowerCase().includes(q)) ||
    (p.color && p.color.toLowerCase().includes(q))
  );
}
