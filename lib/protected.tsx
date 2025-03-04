'use client';

import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {routeByRole, routeByRoleAdmin} from './actions/user.actions';

interface ProtectedProps {
  role: 'user' | 'admin';
  children: React.ReactNode;
}

const ProtectedRoute = ({role, children}: ProtectedProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let user;

        if (role === 'admin') {
          user = await routeByRoleAdmin(); // Fetch only admin users
          if (!user) {
            router.replace('/auth/admin/sign-in');
            return;
          }
        } else {
          user = await routeByRole(); // Fetch only regular users
          if (!user) {
            router.replace('/auth/client/sign-in');
            return;
          }
        }

        // Redirect users if they try to access the wrong role's dashboard
        if (role === 'admin' && !user?.labels?.includes('admin')) {
          router.replace('/dashboard/client');
          return;
        }

        if (role === 'user' && user?.labels?.includes('admin')) {
          router.replace('/dashboard/admin');
          return;
        }
      } catch (error) {
        router.replace(`/auth/${role === 'user' ? 'client' : 'admin'}/sign-in`);
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
