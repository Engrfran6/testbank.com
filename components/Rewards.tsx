import {ChevronRight, Gift} from 'lucide-react';

import {Card} from '@/components/ui/card';

const Rewards = () => {
  return (
    <Card className="group cursor-pointer p-4 hover:bg-blue-100/50 transition-colors">
      <h3 className="font-semibold text-sm md:text-base">Rewards</h3>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded">
            <Gift className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">0</h3>
            <p className="text-sm text-muted-foreground">Ultimate Rewards® points</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};

export default Rewards;
