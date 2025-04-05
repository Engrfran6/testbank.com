'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {toast} from '@/hooks/use-toast';
import {
  deletePendingTransaction,
  getPendingTransactionsById,
  getTrxByTrxId,
  updateTransaction,
} from '@/lib/actions/transaction.actions';
import {parseStringify} from '@/lib/utils';
import {clearCode} from '@/redux/codeSlice';
import {setTransactionDetails} from '@/redux/createTransferDataSlice';
import {RootState} from '@/redux/store';
import {addTransaction} from '@/redux/transactionSlice';
import {Account, Transaction} from '@/types';
import {useDispatch, useSelector} from 'react-redux';

const formSchema = z.object({
  imfCode: z
    .string()
    .min(10, {message: 'IMF code must be at least 10 characters'})
    .max(16, {message: 'IMF code must not exceed 16 characters'})
    .regex(/^[A-Za-z0-9-]+$/, {
      message: 'IMF code must contain only letters, numbers, and hyphens',
    }),
});

export default function ImfCodePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imfcode, setImfCode] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const accountId = searchParams.get('accountId');
  const trxId = searchParams.get('trxId');

  const accounts: any = useSelector((state: RootState) => state.accounts?.data?.data);

  const account = accounts!.find((acc: Account) => acc.$id === accountId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imfCode: '',
    },
  });

  useEffect(() => {
    const getImfCode = async () => {
      const trx = await getTrxByTrxId(trxId as string);
      setImfCode(trx.imfcode);
    };

    getImfCode();
  }, [trxId]);

  if (account?.codestatus !== true) return;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (imfcode === values.imfCode) {
      const data: any = await getPendingTransactionsById(trxId as string)!;
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
        documentId: trxId as string,
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
        dispatch(clearCode());
        await deletePendingTransaction({trxId: trxId as string});

        toast({
          variant: 'success',
          title: 'Successful!',
          description: `You have successfully transfered ${thisTrx.amount} to ${data?.accountNo} | ${data?.recipientName}`,
        });
      }
    } else {
      toast({
        title: 'Invalid IMF code',
        description: 'You provided an incorrect IMF code.',
        variant: 'destructive',
      });
    }

    setIsSubmitting(false);

    router.push('/authenticate/success');
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh]  sm:max-w-[425px] w-[90%] mx-auto">
      {/* <span className="bg-black-1 text-white px-2 py-1 ">{imfcode}</span> */}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">IMF Code Verification</CardTitle>
          <CardDescription className="text-center">
            Enter your International Monetary Fund (IMF) code to proceed with your international
            transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="imfCode"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>IMF Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter IMF code" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your IMF code was sent to your registered email or phone number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  'Verify IMF Code'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            If you haven&apos;t received your IMF code, please contact your account manager.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
