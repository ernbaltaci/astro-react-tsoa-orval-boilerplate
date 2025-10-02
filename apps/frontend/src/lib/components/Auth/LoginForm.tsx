import { useState, FormEvent } from 'react';
import { useLogin } from '@/lib/api/auth/auth';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import withQuery from '@/lib/withQuery';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setLoading } = useAuthStore();

  const loginMutation = useLogin({
    mutation: {
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: (response) => {
        try {
          const token = response?.token;
          if (token) {
            setToken(String(token));
            window.location.assign('/dashboard');
          }
        } catch {
          // ignore
        }
      },
      onError: () => {
        setLoading(false);
      },
      onSettled: () => {
        setLoading(false);
      },
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <form onSubmit={onSubmit} className='mx-auto max-w-sm space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type='submit'
        disabled={loginMutation.isPending}
        className='w-full'
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
      {loginMutation.isError && (
        <p className='text-sm text-red-600'>
          Failed to sign in. Please try again.
        </p>
      )}
    </form>
  );
}

export default withQuery(LoginForm);

