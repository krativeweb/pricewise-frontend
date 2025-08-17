'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddSiteForm() {
  const [baseUrl, setBaseUrl] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const backendBase = 'https://pricewise-scraper-v2.vercel.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const res = await axios.post(`${backendBase}/api/sites`, { baseUrl, name });
      if (res.data.success) {
        setToast({ type: 'success', message: '✅ Site added successfully!' });
        setBaseUrl('');
        setName('');
      } else {
        setToast({ type: 'error', message: res.data.message || 'Failed to add site' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Server error' });
    }

    setLoading(false);
  };

  // auto-hide toast after 3s
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ type: '', message: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="relative bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow">
          🚀 Add a New Site
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Base URL */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              🌐
            </span>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder=" "
              className="peer pl-10 border border-white/40 bg-white/20 rounded-xl w-full p-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/30 transition"
              required
            />
            <label className="absolute left-10 top-3 text-white/70 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-pink-300">
              Base URL
            </label>
          </div>

          {/* Site Name */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              🏷️
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="peer pl-10 border border-white/40 bg-white/20 rounded-xl w-full p-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/30 transition"
              required
            />
            <label className="absolute left-10 top-3 text-white/70 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-pink-300">
              Site Name
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-pink-400/40 hover:scale-105 transition-transform flex justify-center items-center"
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

        {/* Toast */}
        {toast.message && (
          <div
            className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in
              ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
