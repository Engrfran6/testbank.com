'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import * as z from 'zod';

import {BankDropdown} from '@/components/BankDropdown';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {createTransaction} from '@/lib/actions/transaction.actions';
import {cn, generatePin, generateReceiverAccountId, parseStringify} from '@/lib/utils';
import {setAccountId, setOtp, setTransactionDetails} from '@/redux/createTransferDataSlice';
import {Account, PaymentTransferFormProps} from '@/types';
import {useDispatch} from 'react-redux';

const formSchema = z.object({
  senderAccountId: z.string().min(4, 'Please select a valid account'),
  transferNnote: z.string(),
  recieverBank: z.string().min(4, 'Please enter recipient bank name'),
  accountNo: z.string().min(4, 'Please enter recipient account number'),
  routingNo: z.string().min(4, 'Please select a valid routing number'),
  receipentName: z.string().min(4, 'Please enter recipient name'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => parseFloat(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
});

const PaymentTransferForm = ({user, accounts}: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [limitAlert, setLimitAlert] = useState(false);
  const [limitAlert2, setLimitAlert2] = useState(false);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transferNnote: '',
      recieverBank: '',
      accountNo: '',
      routingNo: '',
      receipentName: '',
      amount: '',
      senderAccountId: '',
    },
  });

  const accountId = searchParams.get('id') || accounts[0].$id;

  const account = accounts!.find((acc: Account) => acc.$id === accountId);

  const transferLimit = account?.transferlimit || '500';
  const mintransfer = account?.mintransfer || '100';
  const accountBalance = account?.currentBalance || 0;

  // Watch the amount field to validate against account balance
  const amount = useWatch({
    control: form.control,
    name: 'amount',
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Check if the amount exceeds the account balance
      if (parseFloat(data.amount) > accountBalance) {
        form.setError('amount', {
          type: 'manual',
          message: 'Insufficient balance',
        });
        return;
      }

      // Check if the amount exceeds the transfer limit
      if (parseFloat(data.amount) > parseFloat(transferLimit)) {
        setLimitAlert(true);
        return;
      }

      if (parseFloat(data.amount) < parseFloat(mintransfer)) {
        setLimitAlert2(true);
        return;
      }

      // create default transfer otp first
      const otpTrx = {
        description: ' null',
        senderAccountId: data.senderAccountId,
        receiverAccountId: ' null',
        channel: ' null',
        accountNo: ' null',
        routingNo: ' null',
        recipientName: ' null',
        recipientBank: ' null',
        email: 'null',
        userId: user?.userId,
        amount: parseStringify(0.0),
        type: ' null',
        category: ' null',
        otp: generatePin(6),
      };

      const createOtpOnlyTransaction = await createTransaction(otpTrx);

      // Create transfer transaction
      const transaction = {
        description: data.transferNnote,
        senderAccountId: data.senderAccountId,
        receiverAccountId: generateReceiverAccountId(20),
        channel: 'ACCOUNT_COLLECTION_ID-mobile',
        accountNo: data.accountNo,
        routingNo: data.routingNo,
        recipientName: data.receipentName,
        recipientBank: data.recieverBank,
        email: JSON.stringify(user?.email),
        userId: user?.userId,
        amount: parseFloat(data.amount),
        type: 'debit',
        category: 'Transfer',
      };

      if (otpTrx.otp) {
        dispatch(setTransactionDetails(transaction));
        dispatch(setAccountId(createOtpOnlyTransaction?.$id));
        dispatch(setOtp(createOtpOnlyTransaction?.otp));

        form.reset();
      }
      router.push('/dashboard/access-payment-verification');
    } catch (error) {
      console.error('Submitting create transfer request failed: ', error);
      form.setError('root', {
        type: 'manual',
        message: 'An error occurred while processing your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    setLimitAlert(false);
  };
  const handleProceed2 = async () => {
    setLimitAlert(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col w-full h-full">
        <FormField
          control={form.control}
          name="senderAccountId"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-12 font-medium text-gray-700">
                    Select Source Account
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts!}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transferNnote"
          render={({field}) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-2">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-12 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions related to the
                    transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Bank account details</h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <FormField
          control={form.control}
          name="recieverBank"
          render={({field}) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-2">
                <FormLabel className="text-12 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Bank name
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Bank name" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNo"
          render={({field}) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-2">
                <FormLabel className="text-12 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient&apos;s Account Number
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="ex: 10000290280" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="routingNo"
          render={({field}) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-2">
                <FormLabel className="text-12 w-full max-w-[280px] font-medium text-gray-700">
                  Routing Number
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="ex: 000290110" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receipentName"
          render={({field}) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-2">
                <FormLabel className="text-12 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Name
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Receiver's name" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({field}) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-2">
                <FormLabel className="text-12 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <h3 className="text-[10px] flex">
                    Balance:{' '}
                    <div className="flex ml-1 gap-2 font-bold">
                      <p className="flex gap-0.5">
                        $
                        <span
                          className={cn(
                            'text-gray-500 underline',
                            accountBalance < 0 ? 'text-red-500' : 'text-green-500'
                          )}>
                          {accountBalance}
                        </span>
                      </p>
                      <span className="text-red-500">
                        {parseFloat(amount) > accountBalance
                          ? `Low balance, please fund your account or reduce the amount to send to $${
                              accountBalance - 150
                            }`
                          : ''}
                      </span>
                    </div>
                  </h3>
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="input-class"
                      {...field}
                      type="text"
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />

                  <div className="bg-red-300">
                    <span> min transfer: 100</span>
                    <span> max transfer: 500</span>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              'Transfer Funds'
            )}
          </Button>
        </div>
      </form>

      {limitAlert && (
        <AlertDialog open={limitAlert} onOpenChange={setLimitAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-700">Account limit exceeded!</AlertDialogTitle>
              <AlertDialogDescription className="border-t-2 pt-4">
                The amount{' '}
                <span className="font-bold text-red-700 underline">${parseFloat(amount)}</span> you
                are trying to transfer exceeds your account daily limit of{' '}
                <span className="font-bold text-red-700 underline"> ${transferLimit}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleProceed}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {limitAlert2 && (
        <AlertDialog open={limitAlert2} onOpenChange={setLimitAlert2}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-700 flex">Minimum transfer!</AlertDialogTitle>
              <AlertDialogDescription className="border-t-2 pt-4">
                You can not withdraw{' '}
                <span className="font-bold text-red-700 underline"> ${parseFloat(amount)}</span>, it
                is below the minimum transfer limit of{' '}
                <span className="font-bold underline text-red-700">${mintransfer}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleProceed2}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Form>
  );
};

export default PaymentTransferForm;
