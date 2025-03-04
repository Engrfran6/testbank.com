'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {toast} from '@/hooks/use-toast';
import {routeByRole, routeByRoleAdmin, signIn} from '@/lib/actions/user.actions';
import {authFormSchema} from '@/lib/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {z} from 'zod';
import CustomInput from '../CustomInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {Form} from '../ui/form';

export function SignInCard() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [statusTrigger, setStatusTrigger] = useState(false);
  const [deactivationType, setDeactivationType] = useState<'Suspended' | 'De-Activated'>(
    'Suspended'
  );
  const dispatch = useDispatch();

  const type = 'sign-in';
  const role = 'user';

  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === 'sign-in') {
        const response = await signIn({email: data.email, password: data.password});

        if (!response) {
          toast({
            variant: 'destructive',
            title: 'Login failed!',
            description: 'Invalid Email or password. Please try again!',
          });
          return;
        }

        if (role === 'user') {
          if (response?.status === 'Suspended' || response?.status === 'De-Activated') {
            setDeactivationType(response.status);
            setStatusTrigger(true);
            return;
          } else {
            const user = await routeByRole();
            if (user?.labels.includes('user')) {
              if (response.pin) {
                router.push(
                  `/authenticate/access-verification/?auth_page=${role}&pin=${response.pin}`
                );
                return;
              }
            }
          }
        } else if (role === 'user') {
          const adminUser = await routeByRoleAdmin();
          if (adminUser?.labels.includes('admin')) {
            return;
          }
        }

        toast({
          variant: 'destructive',
          title: 'Access denied!',
          description: 'You are not authorized to log in through this route!',
        });
      }

      toast({
        variant: 'destructive',
        title: 'Login failed!',
        description: 'Invalid credentials or network issue. Please try again!',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border rounded-lg shadow-sm">
      {isLoading && (
        <span>
          <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
        </span>
      )}
      <CardHeader className="pb-2">
        <h2 className="text-xl font-medium">Welcome</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CustomInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              disabled={isLoading}
            />

            <div className="space-y-2">
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Forgot username/password?
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember-me" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full form-btn" size="lg">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </>
              ) : (
                <span> Sign In</span>
              )}
            </Button>
          </form>
        </Form>
        <div>
          <Link
            href="/auth/client/sign-up"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center">
            Not enrolled? Sign up now. <span className="ml-1">›</span>
          </Link>
        </div>
      </CardContent>
      <Dialog open={statusTrigger} onOpenChange={setStatusTrigger}>
        <DialogContent className="sm:max-w-[425px] w-[90%] bg-red-100 border border-red-500 shadow-lg fixed top-[22%] left-1/2 -translate-x-1/2 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-red-900 font-semibold">
              {deactivationType === 'Suspended'
                ? '⚠️ Account Temporarily Disabled'
                : '⛔ Account Permanently Deactivated'}
            </DialogTitle>
            <DialogDescription className="text-red-800">
              {deactivationType === 'Suspended'
                ? 'Your account has been temporarily disabled. Please contact support if you need assistance.'
                : 'Your account has been permanently deactivated. You can no longer log in or access your data.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 text-sm text-red-900 bg-red-200 p-3 rounded-md">
            <p>If you believe this was an error, contact support for assistance.</p>
            <p>
              📧 Email:{' '}
              <a
                href="mailto:support@example.com"
                className="text-red-900 font-medium hover:underline">
                support@example.com
              </a>
            </p>
            <p>
              📞 Phone:{' '}
              <a href="tel:+1234567890" className="text-red-900 font-medium hover:underline">
                +1 (234) 567-890
              </a>
            </p>
          </div>

          <DialogFooter>
            <Button
              className="bg-red-700 text-white hover:bg-red-800"
              onClick={() => setStatusTrigger(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
