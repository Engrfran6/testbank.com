'use client';
import {Button} from '@/components/ui/button';
import {Form} from '@/components/ui/form';
import {signIn, signUp} from '@/lib/actions/user.actions';
import {authFormSchema, generatePin} from '@/lib/utils';
import {setPin} from '@/redux/pinSlice';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {z} from 'zod';
import CustomInput from './CustomInput';

const AuthForm = ({type}: {type: string}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '', // Ensure email is initialized
      password: '',
      ...(type === 'sign-up' && {
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        state: '',
        postalCode: '',
        dateOfBirth: '',
        phone: '',
        country: '',
      }),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(form.formState.errors);

    console.log('i am running');
    try {
      if (type === 'sign-up') {
        const userData = {
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
          pin: generatePin(4),
        };

        const newUser = await signUp(userData);

        if (newUser.verification === 'Not Verified') router.push('/dashboard/client');
      }

      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response?.pin) {
          // Dispatch the response to Redux store
          dispatch(setPin(response?.pin));
        }
        router.push('/dashboard/access-verification');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-1 md:gap-3">
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
          <button
            type="button"
            onClick={() => console.log('Validation errors:', form.formState.errors)}>
            Debug Validation
          </button>
        </form>
      </Form>

      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          {type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
          {type === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </footer>
    </section>
  );
};
export default AuthForm;
