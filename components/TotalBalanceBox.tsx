'use client';

import {TotalBalanceBoxProps} from '@/types';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {useState} from 'react';
import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import {Button} from './ui/button';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from './ui/collapsible';

const TotalBalanceBox = ({
  accounts = [],
  totalAccounts,
  totalCurrentBalance,
  totalDeposits,
  totalWithdrawals,
}: TotalBalanceBoxProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-gray-200 rounded-md">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between border-b-2 p-4">
          <h3 className="font-semibold text-sm md:text-base">Bank accounts</h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="total-balance p-4 md:p-6">
          <div className="total-balance-chart mb-6">
            <DoughnutChart accounts={accounts} />
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-[18px] md:text-[20px] text-[#3589FE] font-semibold">
                {totalAccounts} Bank accounts
              </h3>
              <div className="flex gap-4 flex-wrap">
                <Button className="bg-[#3589FE] text-white text-sm rounded-md">
                  Transfer money
                </Button>
                <Button className="flex gap-2 border border-[#3589FE] text-[#3589FE] text-sm rounded-md">
                  More <ChevronUp size={15} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-2xl md:text-3xl font-bold text-gray-700 flex items-center gap-2">
                  <AnimatedCounter amount={totalCurrentBalance} />
                </p>
                <p className="total-balance-label underline-offset-2">Available balance</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-lg md:text-xl text-gray-700 font-semibold flex items-center gap-2">
                  +<AnimatedCounter amount={totalDeposits} />
                </p>
                <p className="total-balance-label">Deposits this month</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-lg md:text-xl text-gray-700 font-semibold flex items-center gap-2">
                  -<AnimatedCounter amount={totalWithdrawals} />
                </p>
                <p className="total-balance-label">Withdrawals this month</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
export default TotalBalanceBox;
