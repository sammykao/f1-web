'use client';

import { useEffect, useState } from 'react';

interface OtfData {
  workouts: any[];
  stats: Record<string, any>;
  classes: any[];
  bookings: any[];
}

export default function OtfPage() {
  const [data, setData] = useState<OtfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/otf')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to fetch OTF data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading OrangeTheory data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return <div className="p-8">No data found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OrangeTheory Data</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Stats</h2>
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto text-sm">{JSON.stringify(data.stats, null, 2)}</pre>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Workouts</h2>
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto text-sm">{JSON.stringify(data.workouts, null, 2)}</pre>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Classes</h2>
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto text-sm">{JSON.stringify(data.classes, null, 2)}</pre>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Bookings</h2>
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto text-sm">{JSON.stringify(data.bookings, null, 2)}</pre>
      </section>
    </div>
  );
} 