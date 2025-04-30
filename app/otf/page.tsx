'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '../components/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

interface OtfData {
  workouts: any[];
  stats: Record<string, any>;
  classes: any[];
  bookings: any[];
}

export default function OtfPage() {
  const [data, setData] = useState<any | null>(null);
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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">OrangeTheory Dashboard</h1>
      <p className="text-zinc-400 mb-8">Your OTF stats, classes, and progress at a glance.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardTitle>Lifetime Stats</CardTitle>
          <CardDescription>
            <ul className="mt-2 space-y-1">
              {Object.entries(data.stats || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between text-zinc-300">
                  <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                  <span className="font-mono">{String(v)}</span>
                </li>
              ))}
            </ul>
          </CardDescription>
        </Card>
        <Card>
          <CardTitle>This Month</CardTitle>
          <CardDescription>
            <ul className="mt-2 space-y-1">
              {Object.entries(data.stats_this_month || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between text-zinc-300">
                  <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                  <span className="font-mono">{String(v)}</span>
                </li>
              ))}
            </ul>
          </CardDescription>
        </Card>
      </div>
      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="classes">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="studios">Studios</TabsTrigger>
        </TabsList>
        <TabsContent value="classes">
          <Card>
            <CardTitle>Upcoming Classes</CardTitle>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Coach</th>
                    <th className="text-left p-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.classes || []).map((c: any, i: number) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="p-2">{c.date || '-'}</td>
                      <td className="p-2">{c.time || '-'}</td>
                      <td className="p-2">{c.coach_name || '-'}</td>
                      <td className="p-2">{c.class_type || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardTitle>Bookings</CardTitle>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Studio</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.bookings || []).map((b: any, i: number) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="p-2">{b.class_date || '-'}</td>
                      <td className="p-2">{b.status || '-'}</td>
                      <td className="p-2">{b.studio_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardTitle>Performance Summaries</CardTitle>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Calories</th>
                    <th className="text-left p-2">Splat Points</th>
                    <th className="text-left p-2">Avg HR</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.performance_summaries || []).map((p: any, i: number) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="p-2">{p.class_date || '-'}</td>
                      <td className="p-2">{p.calories || '-'}</td>
                      <td className="p-2">{p.splat_points || '-'}</td>
                      <td className="p-2">{p.avg_hr || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="challenges">
          <Card>
            <CardTitle>Challenges</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">By Equipment</h3>
                <ul className="space-y-1">
                  {Object.entries(data.equipment_challenges || {}).map(([k, v]: any) => (
                    <li key={k}>
                      <span className="font-mono text-zinc-400">{k}</span>: <span className="text-zinc-300">{Array.isArray(v) ? v.length : 0} entries</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">By Category</h3>
                <ul className="space-y-1">
                  {Object.entries(data.category_challenges || {}).map(([k, v]: any) => (
                    <li key={k}>
                      <span className="font-mono text-zinc-400">{k}</span>: <span className="text-zinc-300">{Array.isArray(v) ? v.length : 0} entries</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="studios">
          <Card>
            <CardTitle>Studios</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Nearby Studios</h3>
                <ul className="space-y-1">
                  {(data.studios_by_geo || []).map((s: any, i: number) => (
                    <li key={i}>
                      <span className="font-mono text-zinc-400">{s.name}</span> <span className="text-zinc-300">({s.city}, {s.state})</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Favorite Studios</h3>
                <ul className="space-y-1">
                  {(data.favorite_studios || []).map((s: any, i: number) => (
                    <li key={i}>
                      <span className="font-mono text-zinc-400">{s.name}</span> <span className="text-zinc-300">({s.city}, {s.state})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-zinc-200 mb-2">Studio Detail</h3>
              <pre className="bg-zinc-900 text-zinc-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(data.studio_detail, null, 2)}
              </pre>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-zinc-200 mb-2">Studio Services</h3>
              <ul className="space-y-1">
                {(data.studio_services || []).map((svc: any, i: number) => (
                  <li key={i}>
                    <span className="font-mono text-zinc-400">{svc.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 