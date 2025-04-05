'use client';

import {ChevronDown, ChevronUp, Link2} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';

const ExternalAccountBox = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-gray-200 rounded-md">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between border-b-2 p-4">
          <h3 className="font-semibold">External accounts</h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="text-center space-y-4 p-4">
          <p className="text-sm text-zinc-600">
            Link your external accounts to better organize your money, budget and plan for the
            future.
          </p>
          <Button className="flex gap-2  border-2 border-[#3589FE] text-white  text-sm rounded-md mx-auto">
            <Link2 className="h-4 w-4" />
            <span>Link account</span>
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExternalAccountBox;
