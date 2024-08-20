// A simple navbar component
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <Link href="/">Home</Link>
      <Link href="/about" className="ml-4">
        About
      </Link>
    </nav>
  );
}
