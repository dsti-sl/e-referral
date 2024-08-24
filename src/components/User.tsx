'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Button from '@/components/Button';
import { Settings, LogOut, User as AvatarIcon } from 'lucide-react';
import Image from 'next/image';
import { isAuthenticated, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function User() {
  let session = isAuthenticated() ? { user: { image: null } } : null;
  let user = session?.user;

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          onClick={() => {}}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-erefer-rose text-gray-700 hover:text-white"
        >
          {user?.image ? (
            <Image
              src={user.image}
              width={48}
              height={48}
              alt="Avatar"
              className="rounded-full"
            />
          ) : (
            <AvatarIcon className="h-48 w-48 text-white hover:text-black" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={4}>
        <DropdownMenuLabel> Tigidankay Bah </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="text-gray-700 hover:text-gray-900" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="text-gray-700 hover:text-gray-900" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
