"use client"; // ensures this component runs only on the client

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
      <p className="mt-4 text-gray-300">{error.message}</p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
        <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
          Go Home
        </Link>
      </div>
    </div>
  );
}
