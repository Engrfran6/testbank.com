'use client';

import Hero from '@/components/homepage/hero';
import Offers from '@/components/homepage/offers';
import ProductShowcase from '@/components/homepage/product-showcase';
import ServiceGrid from '@/components/homepage/servicegrid';

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-white">
        <Hero />
        <ProductShowcase />
        <section className="container mx-auto px-4 py-12">
          <Offers />
          <ServiceGrid />
        </section>
      </div>
    </div>
  );
};

export default Page;
