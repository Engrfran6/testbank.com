'use client';

import useEmblaCarousel from 'embla-carousel-react';
import {
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LineChart,
  PiggyBank,
  Plane,
} from 'lucide-react';
import * as React from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

const categories = [
  {icon: Plane, label: 'Travel', href: '/travel'},
  {icon: PiggyBank, label: 'Savings', href: '/savings'},
  {icon: Home, label: 'Home loans', href: '/home-loans'},
  {icon: Car, label: 'Auto', href: '/auto'},
  {icon: LineChart, label: 'Investments', href: '/investments'},
];

const products = [
  {
    title: 'Horizon Credit Cards',
    icon: CreditCard,
    heading: "See if you're preapproved",
    description:
      "Learn which Horizon Credit Cards you're preapproved for in just a few moments. Plus, there's no impact to your credit score.",
    buttonText: 'Get started',
    bgColor: 'bg-[#1E4799]',
  },
  {
    title: 'Horizon Freedom Unlimited®',
    icon: CreditCard,
    heading: 'Earn a $200 bonus',
    description:
      'Plus, earn unlimited 1.5% cash back or more on all purchases, including 3% on dining and drugstores — all with no annual fee.',
    buttonText: 'Learn more',
    bgColor: 'bg-[#156CC5]',
  },
  {
    title: 'Horizon Auto',
    icon: Car,
    heading: 'Get prequalification results in seconds',
    description: 'Learn how much you can borrow with no impact on your credit score.',
    buttonText: 'Get prequalified',
    bgColor: 'bg-[#1E4799]',
  },
];

const ProductShowcase = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (emblaApi) {
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <div className="container space-y-8">
      <h2 className="text-3xl font-normal text-center text-gray-800">
        Choose what&apos;s right for you
      </h2>

      {/* Category Icons Carousel */}
      <div className="relative px-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {categories.map((category) => (
              <div key={category.href} className="flex-[0_0_20%] min-w-0">
                <a
                  href={category.href}
                  className="flex flex-col items-center gap-2 text-[#0066CC] hover:text-blue-800">
                  <category.icon className="h-8 w-8" />
                  <span className="text-sm">{category.label}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={scrollPrev}>
          <ChevronLeft className="h-48 w-48" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={scrollNext}>
          <ChevronRight className="h-48 w-48" />
        </Button>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === selectedIndex ? 'bg-[#0066CC]' : 'bg-gray-300'
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>

      {/* Static Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:px-32 pb-6">
        {products.map((product, index) => (
          <Card key={index} className="h-full space-y-5">
            <CardHeader className={`${product.bgColor} text-white p-6`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <product.icon className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-10">
              <h4 className="text-xl font-semibold">{product.heading}</h4>
              <p className="text-gray-600">{product.description}</p>
              <Button className="w-full bg-[#0066CC] hover:bg-blue-700 text-white">
                {product.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ProductShowcase;
