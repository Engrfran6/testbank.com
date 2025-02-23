'use client';

import {Button} from '@/components/ui/button';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {toast} from '@/hooks/use-toast';
import {RootState} from '@/redux/store'; // Import RootState
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useSelector} from 'react-redux';

const PinVerification = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const storedPin = useSelector((state: RootState) => state.pin.pin);

  setTimeout(() => {
    setPin(storedPin);
  }, 200);

  const handleRedirect = () => {
    router.push('/sign-in');
  };

  const handleVerifyPin = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    const enteredPin = formdata.get('pin') as string;

    if (enteredPin === pin) {
      router.push('/dashboard/client');
    } else {
      toast({
        variant: 'destructive',
        title: 'Success!',
        description: 'Incorrect PIN, please try again.',
      });
    }

    setIsLoading(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg w-80 space-y-6">
        <span className="px-8 py-2 bg-black-1 text-white">{pin}</span>
        <h2 className="text-sm font-semibold text-center mb-4 text-blue-700">
          Enter your access pin
        </h2>
        <form onSubmit={handleVerifyPin}>
          <InputOTP maxLength={4} name="pin" placeholder="Enter your 4-digit PIN">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            {/* <InputOTPSeparator /> */}
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleRedirect}>
              Cancel
            </Button>
            <Button disabled={isLoading} className="form-btn">
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
