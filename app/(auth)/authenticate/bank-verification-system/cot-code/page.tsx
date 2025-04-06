'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';

import {generateRandomString} from '@/components/PaymentTransferForm';
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
import {getTrxByTrxId, updateTransaction} from '@/lib/actions/transaction.actions';
import {RootState} from '@/redux/store';
import {Account} from '@/types';
import {useSelector} from 'react-redux';

const formSchema = z.object({
  cotCode: z
    .string()
    .min(6, {message: 'COT code must be at least 6 characters'})
    .max(12, {message: 'COT code must not exceed 12 characters'})
    .regex(/^[A-Za-z0-9-]+$/, {
      message: 'COT code must contain only letters, numbers, and hyphens',
    }),
});

export default function CotCodePage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cotcode, setCotCode] = useState('');
  const router = useRouter();

  const accountId = searchParams.get('accountId');
  const trxId = searchParams.get('trxId');
  const accounts: any = useSelector((state: RootState) => state.accounts?.data?.data);

  const account = accounts!.find((acc: Account) => acc.$id === accountId);

  useEffect(() => {
    const getCotCode = async () => {
      const trx = await getTrxByTrxId(trxId as string);
      setCotCode(trx.cotcode);
    };

    getCotCode();
  }, [trxId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cotCode: '',
    },
  });

  if (!cotcode) return;
  if (account?.codestatus !== true) return;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    if (cotcode === values.cotCode) {
      const data = {
        taxcode: generateRandomString(8),
        trxstep: '1',
      };

      const updateData: any = await updateTransaction({
        documentId: trxId!,
        updates: data,
      });

      toast({
        title: 'COT Code Submitted',
        description: 'Your COT code has been successfully verified.',
        variant: 'success',
      });

      if (updateData?.taxcode !== '0' && updateData.trxstep === '1') {
        router.push(
          `/authenticate/bank-verification-system/tax-code?trxId=${trxId}&accountId=${accountId}`
        );
      }
    } else {
      toast({
        title: 'Invalid COT code',
        description: 'You provided an incorrect COT code.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] sm:max-w-[425px] w-[90%] mx-auto">
      {/* <span className="bg-black-1 text-white px-2 py-1">{cotcode}</span> */}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">COT Code Verification</CardTitle>
          <CardDescription className="text-center">
            Enter your Cost of Transfer (COT) code to proceed with your transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cotCode"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>COT Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter COT code" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your COT code was sent to your registered email or phone number.
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
                  'Verify COT Code'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            If you haven&apos;t received your COT code, please contact your account manager.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
