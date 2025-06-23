"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

type Base = {
  id: number;
  name: string;
  location: string;
};

export default function BasesPage() {
  const [bases, setBases] = useState<Base[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editBaseId, setEditBaseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Fetch all bases
  const fetchBases = async (authToken: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/base`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setBases(res.data.base);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch bases:",
          error.response?.data || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!name || !location) return alert("Please fill all fields");
    if (!token) return alert("Unauthorized. Please login.");

    try {
      if (editBaseId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/base/${editBaseId}`,
          { name, location },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Base updated");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/base`,
          { name, location },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Base created");
      }
      setName("");
      setLocation("");
      setEditBaseId(null);
      fetchBases(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Operation failed");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return alert("Unauthorized");
    const confirmDelete = confirm("Are you sure you want to delete this base?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/base/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBases((prev) => prev.filter((b) => b.id !== id));
      alert("Base deleted");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Deletion failed");
      }
    }
  };

  // Prefill form for edit
  const handleEdit = (base: Base) => {
    setEditBaseId(base.id);
    setName(base.name);
    setLocation(base.location);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      alert("Please log in to access bases");
      return;
    }
    setToken(t);
    fetchBases(t);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📍 Base Management</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {editBaseId ? "✏️ Update Base" : "➕ Create Base"}
          </h2>
          <div className="space-y-4">
            <input
              placeholder="Base Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
            <button
              onClick={handleCreateOrUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editBaseId ? "Update Base" : "Create Base"}
            </button>
            {editBaseId && (
              <button
                onClick={() => {
                  setEditBaseId(null);
                  setName("");
                  setLocation("");
                }}
                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List of bases */}
        {loading ? (
          <p>Loading bases...</p>
        ) : bases.length === 0 ? (
          <p>No bases found.</p>
        ) : (
          <ul className="space-y-4">
            {bases.map((base) => (
              <li
                key={base.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg">{base.name}</p>
                  <p className="text-gray-600">{base.location}</p>
                  <p className="text-xs text-gray-400">ID: {base.id}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(base)}
                    className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(base.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
