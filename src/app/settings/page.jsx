'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MatchThresholdForm() {
  const [threshold, setThreshold] = useState(75);
  const [loading, setLoading] = useState(true);
  const backendBase = 'https://pricewise-scraper-v2.vercel.app';
  useEffect(() => {
    axios.get(`${backendBase}/api/settings/match-threshold`).then(res => {
      setThreshold(res.data.threshold);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${backendBase}/api/settings/match-threshold`, { threshold });
    alert('Threshold updated!');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded">
      <label className="block mb-2 font-medium">Match Score Threshold (%)</label>
      <input
        type="number"
        min="0"
        max="100"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}

