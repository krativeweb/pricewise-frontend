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
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Add New Site</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Base URL</label>
        <input
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com"
          className="border p-2 rounded w-full mb-4"
          required
        />

        <label className="block mb-2 font-medium">Site Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Example Store"
          className="border p-2 rounded w-full mb-4"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center"
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
            'Add Site'
          )}
        </button>
      </form>

      {success && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
