'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
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
import {RootState} from '@/redux/store';
import {useSelector} from 'react-redux';

const formSchema = z.object({
  taxCode: z
    .string()
    .min(8, {message: 'TAX code must be at least 8 characters'})
    .max(15, {message: 'TAX code must not exceed 15 characters'})
    .regex(/^[A-Za-z0-9-]+$/, {
      message: 'TAX code must contain only letters, numbers, and hyphens',
    }),
});

export default function TaxCodePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const taxcode = useSelector((state: RootState) => state.code.code?.taxcode);

  const taxstatus = useSelector((state: RootState) => state.code.code?.taxstatus);

  if (!taxstatus && taxcode) {
    router.push('/authenticate/bank-verification-system/imf-code');
    return;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taxCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    if (taxcode === values.taxCode) {
      toast({
        title: 'TAX Code Submitted',
        description: 'Your TAX code has been successfully verified.',
        variant: 'success',
      });

      setIsSubmitting(false);
    } else {
      toast({
        title: 'Invalid TAX code',
        description: 'You provided an incorrect TAX code.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Redirect to next step or home page
    if (taxstatus) router.push('/authenticate/bank-verification-system/imf-code');
    else router.push('/authenticate/bank-verification-system/failed');
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh]  sm:max-w-[425px] w-[90%] mx-auto">
      <span className="bg-black-1 text-white px-2 py-1">{taxcode}</span>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">TAX Code Verification</CardTitle>
          <CardDescription className="text-center">
            Enter your Tax Clearance (TAX) code to proceed with your transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="taxCode"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>TAX Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter TAX code" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your TAX code was sent to your registered email or phone number.
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
                  'Verify TAX Code'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            If you haven't received your TAX code, please contact your account manager.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
