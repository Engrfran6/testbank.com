'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import * as z from 'zod';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {createPendingTransaction, createTransaction} from '@/lib/actions/transaction.actions';
import {cn, generatePin, generateReceiverAccountId, parseStringify} from '@/lib/utils';
import {RootState} from '@/redux/store';
import {Account, PaymentTransferFormProps} from '@/types';
import {useDispatch, useSelector} from 'react-redux';
import {BankDropdown} from './BankDropdown';
import {Button} from './ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from './ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {Input} from './ui/input';
import {Textarea} from './ui/textarea';

const formSchema = z.object({
  senderAccountId: z.string().min(4, 'Please select a valid account').optional(),
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

export function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

const PaymentTransferForm = ({user, accounts}: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [limitAlert, setLimitAlert] = useState(false);
  const [limitAlert2, setLimitAlert2] = useState(false);
  const [statusAlert, setStatusAlert] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const currentTrxData = useSelector((state: RootState) => state.transaction.transaction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transferNnote: '',
      recieverBank: '',
      accountNo: '',
      routingNo: '',
      receipentName: '',
      amount: '',
      // senderAccountId: '',
    },
  });

  console.log('this is workinng');

  const accountId = searchParams.get('id') || accounts[0].$id;

  const account = accounts!.find((acc: Account) => acc.$id === accountId);

  const transferLimit = account?.transferlimit || '500';
  const mintransfer = account?.mintransfer || '100';
  const status = account?.status;
  const statusMessage = account?.message;
  const accountBalance = account?.currentBalance || 0;

  // Watch the amount field to validate against account balance
  const amount = useWatch({
    control: form.control,
    name: 'amount',
  });

  useEffect(() => {
    if (user?.verification === 'Not Verified') {
      setTrigger(true);
      return; // Stop execution
    }
  }, [user]);

  // const submit = async (data: z.infer<typeof formSchema>) => {
  //   if (user?.verification === 'Not Verified') {
  //     setTrigger(true);
  //     return; // Stop execution
  //   }
  //   setIsLoading(true);

  //   try {
  //     if (status === 'inactive' || status === 'frozen') {
  //       setStatusAlert(true);
  //       return;
  //     }

  //     // Check if the amount exceeds the account balance
  //     if (parseFloat(data.amount) > accountBalance) {
  //       form.setError('amount', {
  //         type: 'manual',
  //         message: 'Insufficient balance',
  //       });
  //       return;
  //     }

  //     // Check if the amount exceeds the transfer limit
  //     if (parseFloat(data.amount) > parseFloat(transferLimit)) {
  //       setLimitAlert(true);
  //       return;
  //     }

  //     if (parseFloat(data.amount) < parseFloat(mintransfer)) {
  //       setLimitAlert2(true);
  //       return;
  //     }

  //     // Create transfer transaction
  //     const transaction = {
  //       senderAccountId: accountId,
  //       receiverAccountId: generateReceiverAccountId(20),
  //       channel: 'online-mobile',
  //       accountNo: data.accountNo,
  //       routingNo: data.routingNo,
  //       recipientName: data.receipentName,
  //       recipientBank: data.recieverBank,
  //       email: JSON.stringify(user?.email),
  //       userId: user?.userId,
  //       amount: parseFloat(data.amount),
  //       type: 'debit',
  //       category: 'Transfer',
  //     };

  //     const transactionType = {
  //       description: data.transferNnote,
  //       senderAccountId: accountId,
  //       receiverAccountId: 'null',
  //       channel: 'null',
  //       accountNo: 'null',
  //       routingNo: 'null',
  //       recipientName: 'null',
  //       recipientBank: 'null',
  //       email: 'null',
  //       userId: user?.userId,
  //       amount: parseStringify(0.0),
  //       type: 'null',
  //       category: 'null',
  //       ...(account?.codestatus === true
  //         ? {cotcode: generateRandomString(6)}
  //         : {otp: generatePin(6)}),
  //     };

  //     if (account?.codestatus === true) {
  //       const createCodeTransaction: any = await createTransaction(transactionType);

  //       if (createCodeTransaction?.cotcode) {
  //         const data = await createPendingTransaction(transaction, createCodeTransaction.$id);
  //         console.log('first==============', data);
  //         if (data === undefined) return;
  //       }
  //       router.push(
  //         `/authenticate/bank-verification-system?trxId=${createCodeTransaction.$id}&accountId=${account.$id}`
  //       );
  //     } else {
  //       const createOtpTransaction: any = await createTransaction(transactionType);
  //       if (createOtpTransaction.otp) {
  //         const data = await createPendingTransaction(transaction, createOtpTransaction.$id);

  //         console.log('first==============', data);
  //         if (data === undefined) return;
  //       }
  //       router.push(
  //         `/authenticate/access-payment-verification?trxId=${createOtpTransaction.$id}&accountId=${account?.$id}`
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Submitting create transfer request failed: ', error);
  //     form.setError('root', {
  //       type: 'manual',
  //       message: 'An error occurred while processing your request. Please try again.',
  //     });
  //   } finally {
  //     // form.reset();
  //     setIsLoading(false);
  //   }
  // };

  const submit = async (data: z.infer<typeof formSchema>) => {
    if (user?.verification === 'Not Verified') {
      setTrigger(true);
      return;
    }
    setIsLoading(true);

    try {
      if (status === 'inactive' || status === 'frozen') {
        setStatusAlert(true);
        return;
      }

      if (parseFloat(data.amount) > accountBalance) {
        form.setError('amount', {
          type: 'manual',
          message: 'Insufficient balance',
        });
        return;
      }

      if (parseFloat(data.amount) > parseFloat(transferLimit)) {
        setLimitAlert(true);
        return;
      }

      if (parseFloat(data.amount) < parseFloat(mintransfer)) {
        setLimitAlert2(true);
        return;
      }

      const transaction = {
        senderAccountId: accountId,
        receiverAccountId: generateReceiverAccountId(20),
        channel: 'online-mobile',
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

      const transactionType = {
        description: data.transferNnote,
        senderAccountId: accountId,
        receiverAccountId: 'null',
        channel: 'null',
        accountNo: 'null',
        routingNo: 'null',
        recipientName: 'null',
        recipientBank: 'null',
        email: 'null',
        userId: user?.userId,
        amount: parseStringify(0.0),
        type: 'null',
        category: 'null',
        ...(account?.codestatus === true
          ? {cotcode: generateRandomString(6)}
          : {otp: generatePin(6)}),
      };

      let redirectUrl = '';
      let transactionId = '';

      if (account?.codestatus === true) {
        const createCodeTransaction = await createTransaction(transactionType);
        transactionId = createCodeTransaction.$id;

        if (createCodeTransaction?.cotcode) {
          await createPendingTransaction(transaction, createCodeTransaction.$id);
        }
        redirectUrl = `/authenticate/bank-verification-system?trxId=${transactionId}&accountId=${account.$id}`;
      } else {
        const createOtpTransaction = await createTransaction(transactionType);
        transactionId = createOtpTransaction.$id;

        if (createOtpTransaction.otp) {
          await createPendingTransaction(transaction, createOtpTransaction.$id);
        }
        redirectUrl = `/authenticate/access-payment-verification?trxId=${transactionId}&accountId=${account?.$id}`;
      }

      if (redirectUrl) {
        router.push(redirectUrl);
      }
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
    setLimitAlert2(false);
  };

  const handleProceed3 = async () => {
    setStatusAlert(false);
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

                  <div className="underline text-sm pt-1 text-red-400">
                    <span> Transfer limit: ${transferLimit}</span>
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

      <div>
        {statusAlert && (
          <AlertDialog open={statusAlert} onOpenChange={setStatusAlert}>
            <AlertDialogContent className="bg-red-200 max-sm:max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 text-md ">
                  OOPS! account activities are temporary restricted!
                </AlertDialogTitle>
                <AlertDialogDescription className="border-y-2 py-4">
                  {statusMessage}
                </AlertDialogDescription>
                <p className="mt-8 text-[11px] leading-4">
                  <span className="text-blue-700 italic underline"> Need help ? </span>
                  <span className="italic">
                    Contact a customer representative or call us at [bank phone number]
                  </span>
                </p>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleProceed3}>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {limitAlert && (
          <AlertDialog open={limitAlert} onOpenChange={setLimitAlert}>
            <AlertDialogContent className="bg-slate-100 border-2 border-red-700 max-sm:max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  Account limit exceeded!
                </AlertDialogTitle>
                <AlertDialogDescription className="border-y-2 py-4">
                  The amount{' '}
                  <span className="font-bold text-red-700 underline">${parseFloat(amount)}</span>{' '}
                  you are trying to transfer exceeds your account daily limit of{' '}
                  <span className="font-bold text-red-700 underline"> ${transferLimit}</span>.
                </AlertDialogDescription>
                <p className="mt-8 text-[11px] leading-4">
                  <span className="text-blue-700 italic underline"> Need help ? </span>
                  <span className="italic">
                    Contact a customer representative or call us at [bank phone number]
                  </span>
                </p>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleProceed}>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {limitAlert2 && (
          <AlertDialog open={limitAlert2} onOpenChange={setLimitAlert2}>
            <AlertDialogContent className="bg-slate-100 border-2 border-red-700 max-sm:max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 flex">Minimum transfer!</AlertDialogTitle>
                <AlertDialogDescription className="border-y-2 py-4 text-sm text-black-1">
                  You can not withdraw{' '}
                  <span className="font-bold text-red-700 underline"> ${parseFloat(amount)}</span>,
                  it is below the minimum transfer limit of{' '}
                  <span className="font-bold underline text-red-700">${mintransfer}</span>
                </AlertDialogDescription>
                <p className="mt-8 text-[12px] leading-4">
                  <span className="text-blue-700 italic underline"> Need help ? </span>
                  <span className="italic">
                    Contact a customer representative or call us at [bank phone number]
                  </span>
                </p>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleProceed2}>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {trigger && (
          <Dialog open={trigger} onOpenChange={setTrigger}>
            <DialogContent className="sm:max-w-[425px] w-[90%] bg-red-50 border border-red-400 shadow-lg left-1/2 -translate-x-1/2 rounded-lg p-6 ">
              <DialogHeader className="text-center">
                <DialogTitle className="text-lg font-semibold text-red-700">
                  Verification Required
                </DialogTitle>
                <DialogDescription className="text-sm text-red-600">
                  Your account is not verified. Please verify your account before proceeding.
                </DialogDescription>
              </DialogHeader>

              <a
                href="/dashboard/client/finish-account-setup"
                className="text-center bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-md transition duration-200 shadow-md">
                setup now
              </a>

              <span className="text-sm text-gray-700">
                Click on <span className="underline italic font-semibold">Finish Setup</span> at the
                top of this page.
              </span>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Form>
  );
};

export default PaymentTransferForm;
