'use client';
import { useState } from 'react';
import axios from 'axios';

export default function AddSiteForm() {
  const [baseUrl, setBaseUrl] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const backendBase = 'https://pricewise-scraper-v2.vercel.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${backendBase}/api/sites`, { baseUrl, name });
      if (res.data.success) {
        setSuccess('✅ Site added successfully!');
        setBaseUrl('');
        setName('');
      } else {
        setError(res.data.message || 'Failed to add site');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Site</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Base URL */}
          <div className="relative">
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder=" "
              className="peer border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-600">
              Base URL
            </label>
          </div>

          {/* Site Name */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="peer border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-600">
              Site Name
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition-colors flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
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
              '➕ Add Site'
            )}
          </button>
        </form>

        {/* Alerts */}
        {success && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-300 text-green-700 text-center animate-fade-in">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-center animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
