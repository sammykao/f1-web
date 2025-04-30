'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '../components/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Navigation } from "../components/nav";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';

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

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!loading && !data) return <div className="p-8">No data found.</div>;

  const formatNumber = (v: any) => {
    if (typeof v === 'number' && !Number.isInteger(v)) {
      return v.toFixed(2);
    }
    return v;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Navigation />
      <h1 className="text-3xl font-bold mb-2">OrangeTheory Dashboard</h1>
      <p className="text-zinc-400 mb-8">Your OTF stats, classes, and progress at a glance.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardTitle>Lifetime Stats</CardTitle>
          <CardDescription>
            <ul className="mt-2 space-y-1">
              {loading || !data ? (
                <li className="animate-pulse h-4 bg-zinc-800 rounded w-3/4 mb-2" />
              ) : (
                Object.entries(data.stats || {}).map(([k, v]) => (
                  <li key={k} className="flex justify-between text-zinc-300">
                    <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                    <span className="font-mono">{formatNumber(v)}</span>
                  </li>
                ))
              )}
            </ul>
          </CardDescription>
        </Card>
        <Card>
          <CardTitle>This Month</CardTitle>
          <CardDescription>
            <ul className="mt-2 space-y-1">
              {loading || !data ? (
                <li className="animate-pulse h-4 bg-zinc-800 rounded w-3/4 mb-2" />
              ) : (
                Object.entries(data.stats_this_month || {}).map(([k, v]) => (
                  <li key={k} className="flex justify-between text-zinc-300">
                    <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                    <span className="font-mono">{formatNumber(v)}</span>
                  </li>
                ))
              )}
            </ul>
          </CardDescription>
        </Card>
      </div>
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="classes">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="studios">Studios</TabsTrigger>
        </TabsList>
        <TabsContent value="classes">
          <Card>
            <CardTitle>Upcoming Classes</CardTitle>
            <div className="overflow-x-auto mt-2">
              {loading || !data ? (
                <div className="h-8 bg-zinc-800 animate-pulse rounded w-full mb-2" />
              ) : (
                <table className="min-w-full text-sm text-white">
                  <thead>
                    <tr className="text-zinc-400">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Coach</th>
                      <th className="text-left p-2">Studio</th>
                      <th className="text-left p-2">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.classes || []).map((c: any, i: number) => {
                      const dt = c.starts_at ? new Date(c.starts_at) : null;
                      return (
                        <tr key={i} className="border-b border-zinc-800">
                          <td className="p-2">{dt ? dt.toLocaleDateString() : '-'}</td>
                          <td className="p-2">{dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                          <td className="p-2">{c.coach || '-'}</td>
                          <td className="p-2">{c.studio || '-'}</td>
                          <td className="p-2">{c.name || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardTitle>Performance Summaries</CardTitle>
            {/* Cool Graphs - now above the table, and data reversed for date order */}
            {(!loading && data && data.performance_summaries && data.performance_summaries.length > 0) && (() => {
              const reversed = [...data.performance_summaries].reverse();
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-zinc-200 mb-2">Calories Burned Over Time</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={reversed.map((p: any) => ({
                        date: p.starts_at ? new Date(p.starts_at).toLocaleDateString() : '',
                        calories: p.calories_burned ?? 0,
                      }))}>
                        <XAxis dataKey="date" stroke="#fff" tick={{ fill: '#fff' }} />
                        <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ background: '#18181b', color: '#fff' }} />
                        <Legend />
                        <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-200 mb-2">Splat Points Over Time</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={reversed.map((p: any) => ({
                        date: p.starts_at ? new Date(p.starts_at).toLocaleDateString() : '',
                        splat: p.splat_points ?? 0,
                      }))}>
                        <XAxis dataKey="date" stroke="#fff" tick={{ fill: '#fff' }} />
                        <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ background: '#18181b', color: '#fff' }} />
                        <Legend />
                        <Bar dataKey="splat" fill="#a21caf" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="font-semibold text-zinc-200 mb-2">Zone Minutes (Last 10 Workouts)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={reversed.slice(-10).map((p: any) => ({
                        date: p.starts_at ? new Date(p.starts_at).toLocaleDateString() : '',
                        gray: formatNumber(p.zone_time_minutes?.gray ?? 0),
                        blue: formatNumber(p.zone_time_minutes?.blue ?? 0),
                        green: formatNumber(p.zone_time_minutes?.green ?? 0),
                        orange: formatNumber(p.zone_time_minutes?.orange ?? 0),
                        red: formatNumber(p.zone_time_minutes?.red ?? 0),
                      }))}>
                        <XAxis dataKey="date" stroke="#fff" tick={{ fill: '#fff' }} />
                        <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ background: '#18181b', color: '#fff' }} />
                        <Legend />
                        <Area type="monotone" dataKey="gray" stackId="1" stroke="#a3a3a3" fill="#a3a3a3" />
                        <Area type="monotone" dataKey="blue" stackId="1" stroke="#60a5fa" fill="#60a5fa" />
                        <Area type="monotone" dataKey="green" stackId="1" stroke="#22c55e" fill="#22c55e" />
                        <Area type="monotone" dataKey="orange" stackId="1" stroke="#f97316" fill="#f97316" />
                        <Area type="monotone" dataKey="red" stackId="1" stroke="#ef4444" fill="#ef4444" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })()}
            <div className="overflow-x-auto mt-2">
              {loading || !data ? (
                <div className="h-8 bg-zinc-800 animate-pulse rounded w-full mb-2" />
              ) : (
                <table className="min-w-full text-sm mb-8 text-white">
                  <thead>
                    <tr className="text-zinc-400">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Class</th>
                      <th className="text-left p-2">Coach</th>
                      <th className="text-left p-2">Calories</th>
                      <th className="text-left p-2">Splat Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.performance_summaries || []).map((p: any, i: number) => {
                      const dt = p.starts_at ? new Date(p.starts_at) : null;
                      return (
                        <tr key={i} className="border-b border-zinc-800">
                          <td className="p-2">{dt ? dt.toLocaleDateString() : '-'}</td>
                          <td className="p-2">{p.class_name || '-'}</td>
                          <td className="p-2">{p.coach || '-'}</td>
                          <td className="p-2">{p.calories_burned !== undefined ? formatNumber(p.calories_burned) : '-'}</td>
                          <td className="p-2">{p.splat_points !== undefined ? formatNumber(p.splat_points) : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardTitle>Bookings</CardTitle>
            <div className="overflow-x-auto mt-2">
              {loading || !data ? (
                <div className="h-8 bg-zinc-800 animate-pulse rounded w-full mb-2" />
              ) : (
                <table className="min-w-full text-sm text-white">
                  <thead>
                    <tr className="text-zinc-400">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Coach</th>
                      <th className="text-left p-2">Studio</th>
                      <th className="text-left p-2">Class</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.bookings || []).map((b: any, i: number) => {
                      const dt = b.starts_at ? new Date(b.starts_at) : null;
                      return (
                        <tr key={i} className="border-b border-zinc-800">
                          <td className="p-2">{dt ? dt.toLocaleDateString() : '-'}</td>
                          <td className="p-2">{dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                          <td className="p-2">{b.coach || '-'}</td>
                          <td className="p-2">{b.studio || '-'}</td>
                          <td className="p-2">{b.class_name || '-'}</td>
                          <td className="p-2">{b.status || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
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
                  {loading || !data ? (
                    <li className="animate-pulse h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                  ) : (
                    Object.entries(data.equipment_challenges || {}).map(([k, v]: any) => (
                      <li key={k}>
                        <span className="font-mono text-zinc-400">{k}</span>: <span className="text-zinc-300">{Array.isArray(v) ? v.length : 0} entries</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">By Category</h3>
                <ul className="space-y-1">
                  {loading || !data ? (
                    <li className="animate-pulse h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                  ) : (
                    Object.entries(data.category_challenges || {}).map(([k, v]: any) => (
                      <li key={k}>
                        <span className="font-mono text-zinc-400">{k}</span>: <span className="text-zinc-300">{Array.isArray(v) ? v.length : 0} entries</span>
                      </li>
                    ))
                  )}
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
                  {loading || !data ? (
                    <li className="animate-pulse h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                  ) : (
                    (data.studios_by_geo || []).map((s: any, i: number) => (
                      <li key={i}>
                        <span className="font-mono text-zinc-400">{s.name}</span> <span className="text-zinc-300">({s.city}, {s.state})</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Favorite Studios</h3>
                <ul className="space-y-1">
                  {loading || !data ? (
                    <li className="animate-pulse h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                  ) : (
                    (data.favorite_studios || []).map((s: any, i: number) => (
                      <li key={i}>
                        <span className="font-mono text-zinc-400">{s.name}</span> <span className="text-zinc-300">({s.city}, {s.state})</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-zinc-200 mb-2">Studio Detail</h3>
              {loading || !data ? (
                <div className="h-8 bg-zinc-800 animate-pulse rounded w-full mb-2" />
              ) : (
                <pre className="bg-zinc-900 text-zinc-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(data.studio_detail, null, 2)}
                </pre>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-zinc-200 mb-2">Studio Services</h3>
              <ul className="space-y-1">
                {loading || !data ? (
                  <li className="animate-pulse h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                ) : (
                  (data.studio_services || []).map((svc: any, i: number) => (
                    <li key={i}>
                      <span className="font-mono text-zinc-400">{svc.name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 