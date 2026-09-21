import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function CollectionList() {
  const collections = [
    { id: 1, title: 'EMBROIDERED KURTA SETS', image: '/images/ethnic_kurta_set_1789624822973.jpg', link: '/collections/kurta-sets' },
    { id: 2, title: 'PASTEL SILK SAREES', image: '/images/ethnic_saree_1789624840596.jpg', link: '/collections/sarees' },
    { id: 3, title: 'FLORAL PRINT LEHENGAS', image: '/images/ethnic_lehenga_1789624855314.jpg', link: '/collections/lehengas' },
    { id: 4, title: 'DESIGNER ANARKALI SUITS', image: '/images/ethnic_anarkali_1789624868513.jpg', link: '/collections/anarkalis' },
    { id: 5, title: 'CHIC PALAZZO SUITS', image: '/images/ethnic_palazzo_suit_1789624892265.jpg', link: '/collections/palazzo-suits' },
    { id: 6, title: 'EMBELLISHED SHARARAS', image: '/images/ethnic_sharara_1789624905126.jpg', link: '/collections/sharara-sets' },
    { id: 7, title: 'MODERN FUSION WEAR', image: '/images/ethnic_fusion_wear_1789624920412.jpg', link: '/collections/indo-western' },
    { id: 8, title: 'TRADITIONAL ETHNIC GOWNS', image: '/images/ethnic_gown_1789624931377.jpg', link: '/collections/gowns' },
  ];

  return (
    <section className="pt-16 md:pt-24 pb-20 bg-white">
      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-[32px] md:text-[36px] font-serif text-center mb-12 text-gray-800 tracking-wide">
          Collection list
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-16">
          {collections.map((collection) => (
            <Link href={collection.link} key={collection.id} className="group block text-center">
              <div className="w-full aspect-[4/5] relative overflow-hidden mb-6 mx-auto" style={{ borderTopLeftRadius: '140px', borderBottomRightRadius: '140px' }}>
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-[12px] md:text-[14px] text-gray-600 tracking-wide px-2 leading-relaxed">
                {collection.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
