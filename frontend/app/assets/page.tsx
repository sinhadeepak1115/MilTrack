"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

type Asset = {
  id: number;
  name: string;
  type: string;
  quantity: number;
  baseId: number;
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [baseId, setBaseId] = useState<number | string>("");
  const [editAssetId, setEditAssetId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async (authToken: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asset`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setAssets(res.data.assets);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch assets:",
          error.response?.data || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!name || !type || quantity === undefined || !baseId) {
      return alert("Please fill all fields.");
    }
    if (!token) return alert("Unauthorized");

    try {
      if (editAssetId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asset/${editAssetId}`,
          {
            name,
            type,
            quantity,
            baseId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Asset updated");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asset`,
          {
            name,
            type,
            quantity,
            baseId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Asset created");
      }
      setName("");
      setType("");
      setQuantity(0);
      setBaseId("");
      setEditAssetId(null);
      fetchAssets(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Operation failed");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    const confirmDelete = confirm(
      "Are you sure you want to delete this asset?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asset/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssets((prev) => prev.filter((a) => a.id !== id));
      alert("Asset deleted");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Deletion failed");
      }
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditAssetId(asset.id);
    setName(asset.name);
    setType(asset.type);
    setQuantity(asset.quantity);
    setBaseId(asset.baseId);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return alert("Please log in.");
    setToken(t);
    fetchAssets(t);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">🎖️ Asset Management</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {editAssetId ? "✏️ Update Asset" : "➕ Create Asset"}
          </h2>
          <div className="space-y-4">
            <input
              placeholder="Asset Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="Type (vehicle, weapon, ammo)"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
            <input
              type="number"
              placeholder="Base ID"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
            <button
              onClick={handleCreateOrUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editAssetId ? "Update Asset" : "Create Asset"}
            </button>
            {editAssetId && (
              <button
                onClick={() => {
                  setEditAssetId(null);
                  setName("");
                  setType("");
                  setQuantity(0);
                  setBaseId("");
                }}
                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List of assets */}
        {loading ? (
          <p>Loading assets...</p>
        ) : assets.length === 0 ? (
          <p>No assets found.</p>
        ) : (
          <ul className="space-y-4">
            {assets.map((asset) => (
              <li
                key={asset.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg">{asset.name}</p>
                  <p className="text-gray-600">Type: {asset.type}</p>
                  <p className="text-gray-600">Qty: {asset.quantity}</p>
                  <p className="text-xs text-gray-400">Base: {asset.baseId}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(asset)}
                    className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
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
