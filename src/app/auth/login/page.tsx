'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem(
        'user',
        JSON.stringify({ email, name: email.split('@')[0] }),
      );
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Login
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 bg-white p-3 text-gray-800 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 bg-white p-3 text-gray-800 focus:border-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700"
        >
          Login
        </button>
        <Link
          href="/auth/signup"
          className="mt-4 block text-center text-blue-600 hover:text-blue-800"
        >
          Need an account? Sign up
        </Link>
      </form>
    </div>
  );
}
