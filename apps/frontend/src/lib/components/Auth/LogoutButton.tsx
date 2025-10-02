import { Button } from '@/lib/components/ui/button';
import { useAuthStore } from '@/lib/store/auth';

export function LogoutButton() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.assign('/auth/login');
  };

  return (
    <Button variant='outline' onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;

