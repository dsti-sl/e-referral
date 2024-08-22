import useRouter from 'next/navigation';
import { User } from '@/components/User';

export default function Header() {
  const router = useRouter;

  return (
    <header className="bg-gray-800 text-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="items-left flex space-x-4">
          <User />
        </div>
      </div>
    </header>
  );
}
