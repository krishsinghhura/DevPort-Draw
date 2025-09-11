"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-gray-300">Oops! Page not found.</p>
      <Link href="/" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Go Home
      </Link>
    </div>
  );
}
