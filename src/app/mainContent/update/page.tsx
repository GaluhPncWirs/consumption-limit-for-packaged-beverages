"use client";

import { useState } from "react";

export default function UpdateFirestoreButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateAllDocuments = async () => {
    setLoading(true);
    setMessage("");

    try {
      const respon = await fetch("/api/update", {
        method: "POST",
      });

      const data = await respon.json();
      setMessage(data.message);
    } catch (error: any) {
      setMessage("Terjadi kesalahan: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={updateAllDocuments}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update Semua Dokumen"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
