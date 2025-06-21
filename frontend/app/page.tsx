"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // ❌ No token = not logged in
      router.push("/login");
    } else {
      // ✅ Token exists
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">🏠 Welcome to the Home Page</h1>
      <p className="mt-2 text-gray-600">You're logged in.</p>

      <button
        onClick={() => {
          localStorage.clear();
          router.push("/login");
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
