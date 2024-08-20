'use client';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

// The content for the "about" page.
export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="gap-50 flex flex-row items-center justify-between">
      <p>This is the about page of the app.</p>
      <Button
        onClick={() => {
          console.log('Button clicked');
          router.push('/');
        }}
      >
        Go to Home
      </Button>
    </div>
  );
}
