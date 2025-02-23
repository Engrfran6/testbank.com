import {ChevronRight, Plane} from 'lucide-react';

import {Card} from '@/components/ui/card';

const Travels = () => {
  return (
    <Card className="group p-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
      <h3 className="font-semibold text-sm md:text-base">Travels</h3>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Explore adventures around the world</h3>
            <p className="text-sm text-muted-foreground">
              Book hotels, flights, car rentals & more
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
};
export default Travels;
