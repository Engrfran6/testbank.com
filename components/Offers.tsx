'use client';

import useEmblaCarousel from 'embla-carousel-react';
import {ChevronRight, Plus} from 'lucide-react';
import * as React from 'react';

import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {cn, getDaysLeft} from '@/lib/utils';
import Image from 'next/image';
import {Button} from './ui/button';

const offers = [
  {
    id: 1,
    name: 'Thuma',
    image: '/icons/house.png?height=200&width=200',
    cashback: '$100 cash back',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    isNew: true,
  },
  {
    id: 2,
    name: 'Lamps Plus',
    image: '/icons/house-2.png?height=200&width=200',
    cashback: '7% cash back',
    endDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000), // 33 days from now
    isNew: true,
  },
  {
    id: 3,
    name: 'The Knot Invitations',
    image: '/icons/deals.png?height=200&width=200',
    cashback: '$20 cash back',
    endDate: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000), // 48 days from now
    isNew: true,
  },
];

const Offers = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const [timeLeft, setTimeLeft] = React.useState<string[]>(
    offers.map((offer) => getDaysLeft(offer.endDate))
  );

  // Update time left every day
  React.useEffect(() => {
    // Initial calculation
    setTimeLeft(offers.map((offer) => getDaysLeft(offer.endDate)));

    // Update every day at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeToMidnight = tomorrow.getTime() - now.getTime();

    // Set initial timeout to sync with midnight
    const initialTimeout = setTimeout(() => {
      setTimeLeft(offers.map((offer) => getDaysLeft(offer.endDate)));

      // Then set up daily interval
      const interval = setInterval(() => {
        setTimeLeft(offers.map((offer) => getDaysLeft(offer.endDate)));
      }, 24 * 60 * 60 * 1000); // 24 hours

      return () => clearInterval(interval);
    }, timeToMidnight);

    return () => clearTimeout(initialTimeout);
  }, []);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Card className="p-4 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm md:text-base">Chase Offers</h3>
        <div className="flex items-center">
          <Badge variant="outline" className="bg-blue-700 text-white">
            33
          </Badge>
          <ChevronRight size={25} />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-muted-foreground">Add deals, shop and get cash back</p>
        <p className="text-sm text-muted-foreground">Freedom Unlimited (...8436)</p>
      </div>

      <CardContent className="p-0 mt-4">
        <div className="overflow-hidden grid grid-cols-3 gap-2" ref={emblaRef}>
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="relative max-h-max flex-[0_0_33.33%] min-w-0 border rounded-lg">
              <div className="relative overflow-hidden ">
                {offer.isNew && (
                  <span className="absolute text-[12px] font-light right-1 top-1 py-0.5 px-1 text-white bg-green-700 rounded-md z-10">
                    New
                  </span>
                )}
                <Image
                  src={offer.image}
                  alt={offer.name}
                  width={500}
                  height={500}
                  className="h-28 w-full object-cover transition-transform"
                />
              </div>

              <span className="absolute bottom-[80px] left-2 w-16 h-16 text-xs italic mx-auto bg-white border-2 rounded-lg flex items-center justify-center">
                {offer.name}
              </span>

              <div className="bg-white inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-4">
                <h3 className="font-light text-[12px]">{offer.name}</h3>
                <p className="text-sm w-full">{offer.cashback}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs opacity-75',
                      parseInt(timeLeft[index]) < 5 ? 'text-red-700 font-bold' : 'text-gray-500'
                    )}>
                    {timeLeft[index]}
                  </span>
                  <Button size="icon" variant="secondary" className="h-6 w-6">
                    <Plus className="h-4 w-4 border-2 border-blue-700 text-blue-700 rounded-full" />
                    <span className="sr-only">Add offer</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Offers;

//  <Button
//             variant="outline"
//             size="icon"
//             className="absolute -left-3 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background"
//             disabled={!canScrollPrev}
//             onClick={scrollPrev}>
//             <ChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Previous slide</span>
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute -right-3 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background"
//             disabled={!canScrollNext}
//             onClick={scrollNext}>
//             <ChevronRight className="h-4 w-4" />
//             <span className="sr-only">Next slide</span>
//           </Button>
//         </div>
//         <div className="flex justify-center gap-1 p-4">
//           {offers.map((_, index) => (
//             <Button
//               key={index}
//               variant="ghost"
//               size="icon"
//               className={`h-2 w-2 rounded-full p-0 ${
//                 index === selectedIndex ? 'bg-primary' : 'bg-muted'
//               }`}
//               onClick={() => emblaApi?.scrollTo(index)}>
//               <span className="sr-only">Go to slide {index + 1}</span>
//             </Button>
//           ))}
//         </div>
