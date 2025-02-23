'use client';

import useEmblaCarousel from 'embla-carousel-react';
import {Briefcase, ChevronLeft, ChevronRight, CreditCard, PiggyBank, Plane} from 'lucide-react';
import * as React from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

const products = [
  {
    icon: Briefcase,
    title: 'Business',
    href: '/business',
    description: 'Manage your business finances',
  },
  {
    icon: CreditCard,
    title: 'Credit cards',
    href: '/credit-cards',
    description: 'Find the right card for you',
  },
  {
    icon: PiggyBank,
    title: 'Checking',
    href: '/checking',
    description: 'Choose your checking account',
  },
  {
    icon: Plane,
    title: 'Travel',
    href: '/travel',
    description: 'Earn travel rewards',
  },
];

const ProductCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div key={product.href} className="flex-[0_0_25%] min-w-0 pl-4 first:pl-0">
              <Card className="group cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-6">
                  <product.icon className="h-8 w-8 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-4 top-1/2 -translate-y-1/2"
        onClick={scrollPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-1/2 -translate-y-1/2"
        onClick={scrollNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
export default ProductCarousel;
