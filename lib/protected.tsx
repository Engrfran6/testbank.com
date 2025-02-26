'use client';

import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {routeByRole} from './actions/user.actions';

interface ProtectedProps {
  role: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({role, children}: ProtectedProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await routeByRole();

        if (!user) {
          router.push('/auth/client/sign-in');
        } else if (role === 'admin' && !user.labels.includes('admin')) {
          router.push('/dashboard/client');
        } else if (role === 'user' && !user.labels.includes('user')) {
          router.push('/dashboard/admin');
        }
      } catch (error) {
        router.push('/auth/client/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [role, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="flex gap-1 items-center text-xl font-medium text-blue-700">
          <Loader2 className="animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
