'use client';

import {Button} from '@/components/ui/button';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {toast} from '@/hooks/use-toast';
import {routeByRole, routeByRoleAdmin} from '@/lib/actions/user.actions';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCallback, useState} from 'react';

const PinVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('auth_page');
  const pin = searchParams.get('pin') || 'No pin found';

  const [isLoading, setIsLoading] = useState(false);

  // Memoize handleRedirect to prevent unnecessary re-creations
  const handleRedirect = useCallback(() => {
    router.push(`/auth/${role === 'admin' ? 'admin' : 'client'}/sign-in`);
  }, [router, role]);

  const handleVerifyPin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formdata = new FormData(e.currentTarget);
    const enteredPin = (formdata.get('pin') as string)?.trim();

    if (enteredPin === pin.trim()) {
      // Fetch user role only if the pin is correct
      const user = role === 'admin' ? await routeByRoleAdmin() : await routeByRole();

      if (user?.labels.includes('admin')) {
        router.push('/dashboard/admin');
      } else if (user?.labels.includes('user')) {
        router.push('/dashboard/client');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed!',
        description: 'Incorrect PIN entered, please try again.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg w-80 space-y-6">
        <span></span>
        <h2 className="text-sm font-semibold text-center mb-4 text-blue-700">
          Enter your access PIN
        </h2>
        <form onSubmit={handleVerifyPin} className="flex flex-col items-center">
          <InputOTP maxLength={4} name="pin" placeholder="Enter your 4-digit PIN">
            <InputOTPGroup>
              <InputOTPSlot index={0} autoFocus />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleRedirect}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </span>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinVerification;
