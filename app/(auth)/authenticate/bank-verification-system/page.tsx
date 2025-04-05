'use client';

import {Button} from '@/components/ui/button';
import {getTrxByTrxId} from '@/lib/actions/transaction.actions';
import {RootState} from '@/redux/store';
import {Account} from '@/types';
import {Loader2, Shield} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const accountId = searchParams.get('accountId');
  const trxId = searchParams.get('trxId');

  const accounts: any = useSelector((state: RootState) => state.accounts?.data?.data);

  const account = accounts!.find((acc: Account) => acc.$id === accountId);

  useEffect(() => {
    const getStep = async () => {
      const trx = await getTrxByTrxId(trxId as string);
      setCurrentStep(parseInt(trx.trxstep));
    };

    getStep();
  }, [trxId]);

  if (account?.codestatus !== true) return;

  // Define the routes for each step
  const routes = [
    `/authenticate/bank-verification-system/cot-code?trxId=${trxId}&accountId=${accountId}`,
    `/authenticate/bank-verification-system/tax-code?trxId=${trxId}&accountId=${accountId}`,
    `/authenticate/bank-verification-system/imf-code?trxId=${trxId}&accountId=${accountId}`,
  ];

  // Function to handle moving to the next step
  const handleNextStep = async () => {
    if (currentStep < routes.length) {
      // Redirect to the next route
      router.push(routes[currentStep]);
      // Update the step
      // setCurrentStep((prevStep) => prevStep + 1);
    } else {
      // If all steps are completed, redirect to a final page or home
      router.push('/dashboard/client');
    }
  };

  const handleFinishStep = () => {
    handleNextStep();
  };

  setTimeout(() => {
    setIsLoading(false);
  }, 6000);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <Shield className="w-12 h-12 mx-auto mb-2 text-blue-700" />
          Banking Verification System
        </h1>

        <div className="flex items-center justify-center mt-[10%]">
          {isLoading ? (
            <div className="flex gap-1 items-center text-xl font-medium text-blue-700">
              <Loader2 className="animate-spin" />
              Authenticating...
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-700">
                  Continue to the next verification page to complete your transaction
                </span>
                <span>
                  <span className="text-xl font-bold underline pt-1 text-blue-700 ">
                    Step: {currentStep} of {routes.length}
                  </span>
                  <span className="ml-1 text-[10px]">completed</span>
                </span>
              </div>
              <Button onClick={handleFinishStep}>Continue</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
