import Hero from '@/components/Hero';
import EverydayEssentials from '@/components/EverydayEssentials';
import CollectionList from '@/components/CollectionList';
import ProductGrid from '@/components/ProductGrid';
import ShopByPrice from '@/components/ShopByPrice';
import FeaturedCategories from '@/components/FeaturedCategories';
import CustomerTestimonials from '@/components/CustomerTestimonials';
import InfluencerPicks from '@/components/InfluencerPicks';
import AsSeenInVogue from '@/components/AsSeenInVogue';
import WatchAndBuy from '@/components/WatchAndBuy';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <main>
      <Hero />
      <EverydayEssentials />
      <CollectionList />
      <ProductGrid />
      <ShopByPrice />
      <FeaturedCategories />
      <CustomerTestimonials />
      <InfluencerPicks />
      <AsSeenInVogue />
      <FAQ />
      <WatchAndBuy />
    </main>
  );
}
