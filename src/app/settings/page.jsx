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

  // Loader UI
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-6 md:p-8">
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
          <div className="flex flex-col items-start">
            <svg
              className="animate-spin h-10 w-10 text-teal-600 mb-4"
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
            <p className="text-gray-600 text-lg">Loading threshold...</p>
          </div>
        </div>
      </div>
    );
  }

  // Form UI
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-6 md:p-8">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-4xl font-extrabold mb-10 text-gray-900">Match Score Threshold</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Threshold Input */}
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder=" "
              className="peer border border-gray-200 rounded-xl w-full p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-lg"
              required
            />
            <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-xs peer-focus:text-teal-600">
              Threshold (%)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-teal-700 transition-all duration-200 flex justify-center items-center text-lg"
            disabled={saving}
          >
            {saving ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
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

        {/* Success Message */}
        {success && (
          <div className="mt-8 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 animate-fade-in text-lg">
            ✅ Threshold updated successfully!
          </div>
        )}
      </div>
    </div>
  );
}
