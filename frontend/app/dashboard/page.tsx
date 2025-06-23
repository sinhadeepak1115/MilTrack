"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type User = {
  id: number;
  username: string;
  role: string;
  baseId: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      console.error("Invalid user data:", err);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome, <span className="text-blue-600">{user.username}</span>!
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                👤 User Info
              </h2>
              <p className="text-gray-600">
                <strong>ID:</strong> {user.id}
              </p>
              <p className="text-gray-600">
                <strong>Role:</strong> {user.role}
              </p>
            </div>

            <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                🏢 Base Info
              </h2>
              <p className="text-gray-600">
                <strong>Base ID:</strong> {user.baseId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
