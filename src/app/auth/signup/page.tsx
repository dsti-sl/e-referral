'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = (e: any) => {
    e.preventDefault();
    if (name && email && password) {
      localStorage.setItem('user', JSON.stringify({ email, name }));
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign Up
        </h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 bg-white p-3 text-gray-800 focus:border-blue-500 focus:outline-none"
          required
        />
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
          Sign Up
        </button>
        <Link
          href="/auth/login"
          className="mt-4 block text-center text-blue-600 hover:text-blue-800"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
