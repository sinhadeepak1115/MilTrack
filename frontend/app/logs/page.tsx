"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

type Log = {
  id: number;
  action: string;
  quantity: number;
  assetId: number;
  userId: number;
  baseId: number;
  targetId?: number;
  notes?: string;
  date: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [action, setAction] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [assetId, setAssetId] = useState<number | string>("");
  const [userId, setUserId] = useState<number | string>("");
  const [baseId, setBaseId] = useState<number | string>("");
  const [targetId, setTargetId] = useState<number | string>("");
  const [notes, setNotes] = useState("");
  const [editLogId, setEditLogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLogs(res.data.logs);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch logs:",
          error.response?.data || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleCreateOrUpdate = async () => {
    if (!action || !quantity || !assetId || !userId || !baseId) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        action,
        quantity,
        assetId,
        userId,
        baseId,
        targetId: targetId || null,
        notes,
      };

      if (editLogId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logs/${editLogId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Log updated");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logs`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Log created");
      }

      resetForm();
      fetchLogs();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Operation failed");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Log deleted");
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Deletion failed");
      }
    }
  };

  const handleEdit = (log: Log) => {
    setEditLogId(log.id);
    setAction(log.action);
    setQuantity(log.quantity);
    setAssetId(log.assetId);
    setUserId(log.userId);
    setBaseId(log.baseId);
    setTargetId(log.targetId ?? "");
    setNotes(log.notes ?? "");
  };

  const resetForm = () => {
    setEditLogId(null);
    setAction("");
    setQuantity(0);
    setAssetId("");
    setUserId("");
    setBaseId("");
    setTargetId("");
    setNotes("");
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📋 Logs Management</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {editLogId ? "✏️ Update Log" : "➕ Create Log"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="px-4 py-2 border rounded bg-gray-100"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="Asset ID"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="Base ID"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              className="px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="Target ID"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="px-4 py-2 border rounded bg-gray-100"
            />
            <input
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="px-4 py-2 border rounded bg-gray-100 col-span-full"
            />
            <div className="flex gap-2 col-span-full">
              <button
                onClick={handleCreateOrUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editLogId ? "Update Log" : "Create Log"}
              </button>
              {editLogId && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Action: {log.action}</p>
                  <p className="text-gray-600">
                    Quantity: {log.quantity} | Asset: {log.assetId} | User:{" "}
                    {log.userId}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Base: {log.baseId} | Target: {log.targetId ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Notes: {log.notes ?? "—"} | Date:{" "}
                    {new Date(log.date).toLocaleString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(log)}
                    className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(log.id)}
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
