'use client';

import { useEffect, useState } from 'react';

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [syncingId, setSyncingId] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const backendBase = 'https://pricewise-scraper-v2.vercel.app'; // ✅ ensure full URL with https

  async function fetchSites() {
    try {
      const res = await fetch(`${backendBase}/api/sites`);
      const json = await res.json();
      if (json.success) setSites(json.data);
    } catch (err) {
      console.error('Failed to fetch sites:', err);
    }
  }

  async function syncSite(id) {
    if (!confirm('Sync this site?')) return;
    setSyncingId(id);
    try {
      const res = await fetch(`${backendBase}/api/scrape/${id}`);
      const json = await res.json();
      alert(json.message || 'Sync completed');
    } catch (err) {
      alert('Failed to sync site');
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧱 Scraper Dashboard</h1>

      {/* Sites Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Sites</h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Base URL</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <tr key={site.id}>
                <td className="p-2 border">{site.id}</td>
                <td className="p-2 border">{site.name}</td>
                <td className="p-2 border">{site.baseUrl}</td>
                <td className="p-2 border text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => syncSite(site.id)}
                    disabled={syncingId === site.id}
                  >
                    {syncingId === site.id ? 'Syncing...' : 'Sync'}
                  </button>
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">No sites found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
