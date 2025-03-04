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
  cotCode: z
    .string()
    .min(6, {message: 'COT code must be at least 6 characters'})
    .max(12, {message: 'COT code must not exceed 12 characters'})
    .regex(/^[A-Za-z0-9]+$/, {message: 'COT code must contain only letters and numbers'}),
});

export default function CotCodePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const cotcode = useSelector((state: RootState) => state.code.code?.cotcode);
  const cotstatus = useSelector((state: RootState) => state.code.code?.cotstatus);
  const taxstatus = useSelector((state: RootState) => state.code.code?.taxstatus);

  if (!cotstatus && cotcode) {
    router.push('/authenticate/bank-verification-system');
    return;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cotCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    if (cotcode === values.cotCode) {
      toast({
        title: 'COT Code Submitted',
        description: 'Your COT code has been successfully verified.',
        variant: 'success',
      });

      setIsSubmitting(false);
    } else {
      toast({
        title: 'Invalid COT code',
        description: 'You provided an incorrect COT code.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Redirect to next step or home page
    if (taxstatus) router.push('/authenticate/bank-verification-system/tax-code');
    else router.push('/authenticate/bank-verification-system/imf-code');
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] sm:max-w-[425px] w-[90%] mx-auto">
      <span className="bg-black-1 text-white px-2 py-1">{cotcode}</span>
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
            If you haven't received your COT code, please contact your account manager.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
