'use client';
import {Button} from '@/components/ui/button';
import {Form} from '@/components/ui/form';
import {toast} from '@/hooks/use-toast';
import {
  routeByRole,
  routeByRoleAdmin,
  signIn,
  signInAdmin,
  signUp,
} from '@/lib/actions/user.actions';
import {authFormSchema} from '@/lib/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {z} from 'zod';
import CustomInput from './CustomInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const AuthForm = ({type, role}: {type: string; role: string}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [statusTrigger, setStatusTrigger] = useState(false);
  const [deactivationType, setDeactivationType] = useState<'Suspended' | 'De-Activated'>(
    'Suspended'
  );
  const dispatch = useDispatch();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: '', // Ensure email is initialized
      password: '',
      ...(type === 'sign-up'
        ? {
            firstName: '',
            lastName: '',
            address1: '',
            city: '',
            state: '',
            postalCode: '',
            dateOfBirth: '',
            phone: '',
            country: '',
          }
        : {}),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let response;
      if (type === 'sign-up') {
        response = await signUp({
          email: data.email,
          password: data.password,
          firstname: data.firstName!,
          lastname: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          country: data.country!,
          phone: data.phone!,
          role,
        });

        if (response?.$id) {
          router.push(
            `/authenticate/create-access-verification/?$id=${response.$id}&email=${data.email}&password=${data.password}`
          );
          return;
        }
      } else if (type === 'sign-in') {
        response =
          role === 'admin'
            ? await signInAdmin({email: data.email, password: data.password})
            : await signIn({email: data.email, password: data.password});

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
        } else if (role === 'admin') {
          const adminUser = await routeByRoleAdmin();
          if (adminUser?.labels.includes('admin')) {
            if (response.pin) {
              router.push(
                `/authenticate/access-verification/?auth_page=${role}&pin=${response.pin}`
              );
              return;
            }
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
        title: type === 'sign-in' ? 'Login failed!' : 'Registration failed!',
        description: 'Invalid credentials or network issue. Please try again!',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred!',
        description: `Something went wrong. Please try again later... ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-16 lg:text-32 mb-8 font-bold  text-gray-900">
            {role === 'admin' ? 'ADMIN USER ONLY' : ''}
          </h1>
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-16 font-normal text-gray-600">{'Please enter your details'}</p>
        </div>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === 'sign-up' && (
            <>
              <div className="flex gap-4">
                <CustomInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  disabled={isLoading}
                />
                <CustomInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  disabled={isLoading}
                />
              </div>
              <CustomInput
                control={form.control}
                name="address1"
                label="Address"
                placeholder="Enter your address"
                disabled={isLoading}
              />
              <CustomInput
                control={form.control}
                name="city"
                label="City"
                placeholder="Enter your city"
                disabled={isLoading}
              />
              <div className="flex gap-4">
                <CustomInput
                  control={form.control}
                  name="state"
                  label="State"
                  placeholder="Enter your state"
                  disabled={isLoading}
                />
                <CustomInput
                  control={form.control}
                  name="postalCode"
                  label="Postal Code"
                  placeholder="Enter your postal code"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <CustomInput
                  control={form.control}
                  name="country"
                  label="Country"
                  placeholder="Enter country"
                  disabled={isLoading}
                />
                <CustomInput
                  control={form.control}
                  name="phone"
                  label="Phone number"
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>
            </>
          )}
          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </>
              ) : type === 'sign-in' ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          {type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <Link
          href={
            type === 'sign-in'
              ? `/auth/${role === 'user' ? 'client' : 'admin'}/sign-up`
              : `/auth/${role === 'user' ? 'client' : 'admin'}/sign-in`
          }
          className="form-link">
          {type === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </footer>

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

      <Dialog open={statusTrigger} onOpenChange={setStatusTrigger}>
        <DialogContent className="sm:max-w-[425px] w-[90%] bg-red-50 border border-red-400 shadow-lg fixed top-[10%] left-1/2 -translate-x-1/2 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-red-700">⚠️ Account Suspended</DialogTitle>
            <DialogDescription className="text-red-600">
              Your account has been suspended. If you believe this is a mistake, please contact our
              support team.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 text-sm text-red-700 bg-red-100 p-3 rounded-md">
            <p>
              📧 Email:{' '}
              <a
                href="mailto:support@example.com"
                className="text-red-800 font-medium hover:underline">
                support@example.com
              </a>
            </p>
            <p>
              📞 Phone:{' '}
              <a href="tel:+1234567890" className="text-red-800 font-medium hover:underline">
                +1 (234) 567-890
              </a>
            </p>
          </div>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => setStatusTrigger(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
export default AuthForm;
