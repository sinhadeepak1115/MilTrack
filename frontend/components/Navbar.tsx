"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  username: string;
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading || !user) return null;
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">🇮🇳 MilTrack</div>
        <div className="space-x-6 flex items-center">
          <a href="/dashboard" className="hover:text-blue-400">
            Dashboard
          </a>
          <a href="/assets" className="hover:text-blue-400">
            Assets
          </a>
          <a href="/logs" className="hover:text-blue-400">
            Logs
          </a>
          <a href="/bases" className="hover:text-blue-400">
            Bases
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
