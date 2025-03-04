'use client';

import {Button} from '@/components/ui/button';
import {Loader2, Shield} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Define the routes for each step
  const routes = [
    '/authenticate/bank-verification-system/cot-code',
    '/authenticate/bank-verification-system/tax-code',
    '/authenticate/bank-verification-system/imf-code',
  ];

  // Function to handle moving to the next step
  const handleNextStep = () => {
    if (currentStep < routes.length) {
      // Redirect to the next route
      router.push(routes[currentStep]);
      // Update the step
      setCurrentStep((prevStep) => prevStep + 1);
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

        <div className="flex items-center justify-center mt-[30%]">
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
