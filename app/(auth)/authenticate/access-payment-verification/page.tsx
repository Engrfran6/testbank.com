'use client';

import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {toast} from '@/hooks/use-toast';
import {
  deletePendingTransaction,
  getPendingTransactionsById,
  getTrxByTrxId,
  updateTransaction,
} from '@/lib/actions/transaction.actions';
import {maskEmail, maskPhone, parseStringify} from '@/lib/utils';
import {setTransactionDetails} from '@/redux/createTransferDataSlice';
import {RootState} from '@/redux/store'; // Import RootState
import {addTransaction} from '@/redux/transactionSlice';
import {Account, Transaction} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {z} from 'zod';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

const TranssferVerification = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string>('');

  const user = useSelector((state: RootState) => state.user.user);

  const searchParams = useSearchParams();

  const accountId = searchParams.get('accountId');
  const trxId = searchParams.get('trxId');

  const accounts: any = useSelector((state: RootState) => state.accounts?.data?.data);

  const account = accounts!.find((acc: Account) => acc.$id === accountId);

  useEffect(() => {
    const getOtp = async () => {
      const trx = await getTrxByTrxId(trxId as string);
      setOtp(trx.otp);
    };

    getOtp();
  }, [trxId]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  const handleRedirect = () => {
    router.push('/dashboard/client/payment-transfer');
  };

  const handleSubmitOTP = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    if (data.pin === otp) {
      const data: any = await getPendingTransactionsById(trxId as string);

      const newData = {
        senderAccountId: data.senderAccountId,
        receiverAccountId: data.receiverAccountId,
        channel: data.channel,
        accountNo: data.accountNo,
        routingNo: data.routingNo,
        recipientName: data.receipentName,
        recipientBank: data.recieverBank,
        email: data?.email,
        userId: data?.userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
      };

      const newTransaction: Transaction = await updateTransaction({
        documentId: trxId!,
        updates: newData,
      });

      if (newTransaction) {
        const thisTrx = {
          $id: newTransaction.$id,
          amount: parseStringify(newTransaction.amount!),
          description: newTransaction.description,
          $createdAt: newTransaction.$createdAt,
          type: newTransaction.type,
          status: newTransaction.status,
        };

        dispatch(addTransaction(thisTrx));
        dispatch(setTransactionDetails(newTransaction));
        await deletePendingTransaction({trxId: trxId as string});

        toast({
          variant: 'success',
          title: 'Success!',
          description: `You have successfully transfered ${thisTrx.amount} to ${data?.accountNo} | ${data?.recipientName}`,
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Transfer failed!',
        description: 'Invalid / expired OTP code, please try again.',
      });
    }

    setIsLoading(false);

    router.push('/authenticate/success');
  };

  const [selectedMethod, setSelectedMethod] = useState('email');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const otpType = event.target.value;
    setSelectedMethod(otpType);
  };

  if (account?.codestatus !== false) return;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <span></span>
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg mx-4 md:w-[35%] space-y-6">
        <div className="w-full">
          <select
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded-md bg-blue-50 px-4 py-2 text-left focus:outline-none"
            defaultValue="choose OTP method">
            <option value={user?.email}>{user?.email}</option>
            <option value={user?.phone}>{user?.phone}</option>
          </select>
        </div>
        <h2 className="text-sm font-semibold text-center mb-4 text-blue-700 border-b-2 pb-2">
          A One Time Pass code has been sent to your registered email address:{''}
          {maskEmail(user?.email as string)}
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitOTP)}
            className="w-2/3 space-y-14 flex flex-col items-center ">
            <FormField
              control={form.control}
              name="pin"
              render={({field}) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} autoFocus />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your registered{' '}
                    {selectedMethod === 'phone'
                      ? `phone number: ${maskPhone(JSON.stringify(user?.phone))}`
                      : `email address: ${user?.email}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        </Form>
      </div>
    </div>
  );
};

export default TranssferVerification;
