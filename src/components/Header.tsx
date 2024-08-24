import useRouter from 'next/navigation';
import { User } from '@/components/User';

export default function Header() {
  const router = useRouter;

  return (
    <header className="w-full bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex-1"></div>
        <div className="items-right right-12 flex justify-end">
          <User />
        </div>
      </div>
    </header>
  );
}
