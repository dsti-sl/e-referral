// 'use client';
// import useRouter from 'next/navigation';
// import { User } from '@/components/User';
// import { Bell } from 'lucide-react';

// export default function Header() {
//   const router = useRouter;

//   return (
//     <header className="w-full bg-white">
//       <div className="container flex items-center justify-between px-6 py-4">
//         <div className="items-left flex justify-start">
//           <img
//             src="/DSTI-Longform-Logo-Dark.png"
//             alt="DSTI Logo"
//             className="h-12 w-auto"
//           />
//         </div>
//         <div className="flex-1"></div>
//         <div className="items-left justify-left flex">
//           <Bell className="mr-4 mt-3 text-erefer-rose hover:text-erefer-light" />
//           <User />
//         </div>
//       </div>
//     </header>
//   );
// }

'use client';
import { useRouter } from 'next/navigation';
import { User } from '@/components/User';
import { Bell } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full bg-white">
      <div className="container flex flex-wrap items-center justify-between px-6 py-4">
        <div className="flex justify-start">
          <img
            src="/DSTI-Longform-Logo-Dark.png"
            alt="DSTI Logo"
            className="h-12 w-auto"
          />
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center justify-start space-x-4">
          <Bell className="text-erefer-rose hover:text-erefer-light" />
          <User />
        </div>
      </div>
    </header>
  );
}
