'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {toast} from '@/hooks/use-toast';
import {signIn} from '@/lib/actions/user.actions';
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
import {Form} from '../ui/form';

export function SignInCard() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const type = 'sign-in';

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
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response?.pin) {
          router.push(`/authenticate/access-verification?pin=${response?.pin}`);
        } else {
          toast({
            variant: 'destructive',
            title: 'Login failed!',
            description: 'Inavalid Email or password, Please try again!.',
          });
        }
      }
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
            href="/sign-up"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center">
            Not enrolled? Sign up now. <span className="ml-1">›</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
