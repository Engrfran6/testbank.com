'use client';

import {Button} from '@/components/ui/button';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {signIn, updateUserWithPin} from '@/lib/actions/user.actions';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useState} from 'react';

const CreateVerificationCode = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const $id = searchParams.get('$id') || 'No document Id';
  const email = searchParams.get('email') || 'No user email';
  const password = searchParams.get('password') || 'No user password';

  const handleRedirect = () => {
    router.push('/auth/client/sign-in');
  };

  const handleCreatePin = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    const enteredPin = formdata.get('pin') as string;

    const response = await updateUserWithPin({
      documentId: $id as string,
      updates: {pin: enteredPin},
    });

    if (response?.pin === enteredPin) {
      await signIn({
        email: email,
        password: password,
      });
    } else return;

    router.push('/dashboard/client');

    setIsLoading(false);
  };
  return (
    <div className="fixed inset-0 flex flex-col gap-20 items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col md:flex-row justify-center items-center italic bg-blue-700 text-white shadow-md w-full py-16">
        <span>Thank you for creating account with us...! </span>
        <span>Now let's secure your account</span>
      </div>
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg w-80 space-y-6">
        <h2 className="text-[12px] font-semibold text-center mb-4 text-blue-700">
          Create a 4-digits access pin
        </h2>
        <form onSubmit={handleCreatePin} className="flex flex-col items-center">
          <InputOTP maxLength={4} name="pin" placeholder="Enter your 4-digit PIN">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
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

export default CreateVerificationCode;
