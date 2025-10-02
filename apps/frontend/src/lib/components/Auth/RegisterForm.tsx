import { useState, FormEvent } from 'react';
import { useRegister } from '@/lib/api/auth/auth';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import withQuery from '@/lib/withQuery';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setLoading } = useAuthStore();

  const registerMutation = useRegister({
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
          } else {
            console.error('Token not found in response');
          }
        } catch (error) {
          console.error('Error setting token:', error);
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
    registerMutation.mutate({ data: { email, password } });
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
        disabled={registerMutation.isPending}
        className='w-full'
      >
        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
      </Button>
      {registerMutation.isError && (
        <p className='text-sm text-red-600'>
          Registration failed. Please try again.
        </p>
      )}
    </form>
  );
}

export default withQuery(RegisterForm);

