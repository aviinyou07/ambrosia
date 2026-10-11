import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogsPage() {
  const posts = [
    {
      id: 1,
      title: 'How to Style Pastel Organza Sarees for Daytime Celebrations',
      date: 'October 9, 2026',
      readTime: '4 min read',
      image: '/images/ethnic_saree_1789624840596.jpg',
      category: 'Styling Guide',
      excerpt: 'Organza sarees are the epitome of ethereal grace. Discover how to pair pearl chokers, minimal blouses, and subtle makeup to create an unforgettable daytime wedding look.',
    },
    {
      id: 2,
      title: 'The Revival of Pure Cambric Cotton in Festive Ethnic Wear',
      date: 'September 28, 2026',
      readTime: '5 min read',
      image: '/images/ethnic_kurta_set_1789624822973.jpg',
      category: 'Artisanal Stories',
      excerpt: 'Why stiff synthetic silks are taking a backseat to breathable natural textiles. How our Jaipur artisans blend heirloom block printing with contemporary silhouettes.',
    },
    {
      id: 3,
      title: 'From Sangeet to Cocktail: Choosing the Perfect Fusion Gown',
      date: 'September 15, 2026',
      readTime: '3 min read',
      image: '/images/ethnic_gown_1789624931377.jpg',
      category: 'Occasion Edit',
      excerpt: 'Transition from traditional festivities into late-night receptions effortlessly with asymmetric drapes, cape sleeves, and structured cowl pants.',
    },
  ];

  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase mb-2 block">
            The Avyara Journal
          </span>
          <h1 className="text-[32px] md:text-[42px] font-serif text-gray-900 mb-4 tracking-wide uppercase">
            Stories & Styling
          </h1>
          <p className="text-gray-500 text-sm font-light max-w-md mx-auto">
            Dispatches on textile heritage, seasonal wardrobe curation, and behind-the-scenes artisanal craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-white/90 text-gray-800 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1">
                  {post.category}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-[11px] text-gray-400 tracking-wide font-light flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="font-serif text-xl text-gray-900 group-hover:text-[#4e342e] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="pt-2">
                  <Link 
                    href="/collections/new-arrivals" 
                    className="text-xs font-semibold uppercase tracking-wider text-[#4e342e] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Read Journal & Shop Collection →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}
