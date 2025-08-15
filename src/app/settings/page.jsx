'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MatchThresholdForm() {
  const [threshold, setThreshold] = useState(75);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const backendBase = 'https://pricewise-scraper-v2.vercel.app';
  // Fetch threshold on mount
  useEffect(() => {
    axios.get(`${backendBase}/api/settings/match-threshold`).then(res => {
      setThreshold(res.data.threshold);
      setLoading(false);
    });
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await axios.post(`${backendBase}/api/settings/match-threshold`, { threshold });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000); // Auto hide after 3s
  };

  // 🔹 Loader UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading threshold...</p>
        </div>
      </div>
    );
  }

  // 🔹 Form UI
  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">
          Match Score Threshold (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
          disabled={saving}
        >
          {saving ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            'Save'
          )}
        </button>
      </form>

      {/* Success message */}
      {success && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ Threshold updated successfully!
        </div>
      )}
    </div>
  );
}
