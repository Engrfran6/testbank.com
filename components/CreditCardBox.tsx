'use client';

import {ChevronDown, ChevronUp, CreditCard} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';

import Image from 'next/image';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from './ui/collapsible';

const CreditCardBox = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-gray-200 rounded-md">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between border-b-2 p-4">
          <h3 className="font-semibold">Credit cards</h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 ">
              <CreditCard className="h-5 w-5" />
              <h3 className="text-[13px] text-[#3589FE] font-semibold">
                Freedom Unlimited (...8436)
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="bg-[#3589FE] text-white text-sm rounded-md">Pay card</Button>
              <Button className="flex gap-2  border border-[#3589FE] text-[#3589FE] text-sm rounded-md">
                More
                {isCardOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex gap-2 items-start  bg-gray-100 p-4 rounded-sm">
              <div className="h-3 w-3 mt-2 rounded-full bg-black-2" />
              <div>
                <p className="text-[13px] leading-3">Your new card is here!</p>
                <a
                  href="#"
                  className="text-[#3589FE] inline-flex items-center text-[12px] leading-3 underline">
                  Finish setting up your account
                </a>
              </div>
            </div>

            <div className="flex gap-2 items-start bg-gray-100 p-4 rounded-sm">
              <div className="h-3 w-3 mt-2 rounded-full bg-green-500" />
              <div>
                <p className="text-[13px] mb-1">You don&apos;t have a payment due right now.</p>
                <p className="text-[12px] leading-3 ">
                  Your next statement period ends on Jan 22, 2025.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start pt-2">
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-gray-700">$0.00</span>
                </div>
                <p className="text-sm text-muted-foreground">Current balance</p>
              </div>
              <Image
                src="/icons/credit-card.png"
                width={100}
                height={180}
                alt="Credit Card"
                className="h-[60px] rounded"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div>
                <p className="text-xl font-medium text-gray-700">$0.00</p>
                <p className="text-sm text-muted-foreground">Last statement balance</p>
              </div>
              <div>
                <p className="text-xl font-medium text-gray-700">$2,000.00</p>
                <p className="text-sm text-muted-foreground">Available credit</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CreditCardBox;
