import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '../../store/auth';
import { Link } from '../ui/link';

type AuthGateProps = {
  children: ReactNode;
  redirectTo?: string;
};

export function AuthGate({
  children,
  redirectTo = '/auth/login',
}: AuthGateProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.assign(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p>Loading...</p>
        <p>Please wait while we check your authentication.</p>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className='flex flex-col gap-4 min-h-screen items-center justify-center'>
        <p>You don&apos;t have access to this page. </p>
        <Link href='/auth/login'>Login</Link>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGate;

