"use client";

import { useEffect, useState, useRef } from "react";
import { F1Client, F1Driver, F1Constructor, F1RaceResult, F1QualifyingResult, F1Race } from "../lib/f1";
import { Card } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

interface F1StatsProps {
  refreshInterval?: number;
}

// Add a custom hook for responsive chart rendering
function useResponsiveChartDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        const height = width < 640 ? 200 : 300; // Shorter height on mobile
        setDimensions({ width, height });
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { chartRef, dimensions };
}

export function F1Stats({ refreshInterval = 60000 }: F1StatsProps) {
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [constructors, setConstructors] = useState<F1Constructor[]>([]);
  const [lastRace, setLastRace] = useState<F1RaceResult[]>([]);
  const [qualifyingResults, setQualifyingResults] = useState<F1QualifyingResult[]>([]);
  const [schedule, setSchedule] = useState<F1Race[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [driverHistory, setDriverHistory] = useState<F1RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const f1Client = new F1Client();

  // Common chart tooltip style
  const tooltipStyle = {
    backgroundColor: 'rgba(24, 24, 27, 0.9)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: 'white'
  };

  // Common chart container style
  const chartContainerStyle = "w-full overflow-hidden touch-pan-x";

  async function fetchData() {
    try {
      const [
        driverStandings,
        constructorStandings,
        raceResults,
        qualifying,
        seasonSchedule
      ] = await Promise.all([
        f1Client.getDriverStandings(),
        f1Client.getConstructorStandings(),
        f1Client.getLastRaceResults(),
        f1Client.getLastQualifying(),
        f1Client.getSeasonSchedule()
      ]);

      setDrivers(driverStandings);
      setConstructors(constructorStandings);
      setLastRace(raceResults);
      setQualifyingResults(qualifying);
      setSchedule(seasonSchedule);
      setError(null);

      // Fetch history for the first driver by default
      if (driverStandings.length > 0 && !selectedDriver) {
        setSelectedDriver(driverStandings[0].id);
        const history = await f1Client.getDriverResults(driverStandings[0].id, 100);
        setDriverHistory(history);
      }
    } catch (err) {
      setError('Failed to fetch F1 data');
      console.error('Error fetching F1 data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDriverHistory(driverId: string) {
    try {
      // Get all races for the season by setting a high limit
      const history = await f1Client.getDriverResults(driverId, 100);
      setDriverHistory(history);
      setSelectedDriver(driverId);
    } catch (err) {
      console.error('Error fetching driver history:', err);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return <div className="animate-pulse">Loading F1 Stats...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const nextRace = schedule.find(race => {
    const raceDate = parseISO(`${race.date}T${race.time || '00:00:00'}`);
    return raceDate > new Date();
  });

  return (
    <div className="space-y-8">
      {nextRace && (
        <Card className="p-4 md:p-6 bg-gradient-to-r from-red-500 to-blue-500 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Next Race</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg md:text-xl">{nextRace.raceName}</h3>
              <p className="text-sm opacity-90">{nextRace.circuit.name}</p>
              <p className="text-sm opacity-90">{nextRace.circuit.location}, {nextRace.circuit.country}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Race:</span> {format(parseISO(`${nextRace.date}T${nextRace.time || '00:00:00'}`), 'PPP p')}
              </p>
              {nextRace.sessions.qualifying && (
                <p className="text-sm">
                  <span className="font-semibold">Qualifying:</span> {format(parseISO(`${nextRace.sessions.qualifying.date}T${nextRace.sessions.qualifying.time || '00:00:00'}`), 'PPP p')}
                </p>
              )}
              {nextRace.sessions.sprint && (
                <p className="text-sm">
                  <span className="font-semibold">Sprint:</span> {format(parseISO(`${nextRace.sessions.sprint.date}T${nextRace.sessions.sprint.time || '00:00:00'}`), 'PPP p')}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="drivers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="constructors">Constructors</TabsTrigger>
          <TabsTrigger value="lastrace">Last Race</TabsTrigger>
          <TabsTrigger value="qualifying">Qualifying</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <Card className="p-4 md:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow 
                    key={driver.id} 
                    onClick={() => fetchDriverHistory(driver.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedDriver === driver.id ? 'bg-zinc-100 dark:bg-gray-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <TableCell>{driver.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono hidden md:inline">{driver.number}</span>
                        <div className="relative group">
                          <span>{driver.firstName} {driver.lastName}</span>
                          <div className="absolute left-0 top-full mt-2 z-50 hidden group-hover:block">
                            <div className="bg-zinc-900 text-white p-4 rounded-lg shadow-lg">
                              <h4 className="font-semibold">{driver.firstName} {driver.lastName}</h4>
                              <p className="text-sm">Number: {driver.number}</p>
                              <p className="text-sm">Nationality: {driver.nationality}</p>
                              <p className="text-sm">Wins: {driver.wins}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 md:w-3 md:h-3 rounded-full" 
                          style={{ backgroundColor: driver.team.color }}
                        />
                        <span className="hidden md:inline">{driver.team.name}</span>
                        <span className="md:hidden">{driver.team.name.split(' ')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{driver.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedDriver && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Points Distribution</h3>
                <div className={`${chartContainerStyle} h-[400px]`}>
                  <ResponsiveContainer width="100%" height="100%" debounce={50}>
                    <PieChart>
                      <Pie
                        data={drivers.map(driver => ({
                          name: `${driver.firstName} ${driver.lastName}`,
                          value: driver.points,
                          team: driver.team,
                          percentage: (driver.points / drivers.reduce((sum, d) => sum + d.points, 0) * 100).toFixed(1)
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={1}
                        labelLine={false}
                        label={false}
                      >
                        {drivers.map((driver) => (
                          <Cell 
                            key={driver.id} 
                            fill={driver.team.color}
                            stroke={selectedDriver === driver.id ? '#fff' : 'transparent'}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value: number, name: string, entry: any) => [
                          <div key="details" className="space-y-1 text-white">
                            <div className="font-medium text-white">{value} points</div>
                            <div className="text-sm text-white opacity-75">{entry.payload.percentage}% of total</div>
                            <div className="text-sm text-white opacity-75">Team: {entry.payload.team.name}</div>
                          </div>,
                          <div key="name" className="font-medium text-white">{name}</div>
                        ]}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{
                          paddingLeft: '20px',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}
                        content={({ payload }) => (
                          <div className="text-sm space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {payload?.map((entry: any, index: number) => (
                              <div 
                                key={`legend-${index}`}
                                className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                                  selectedDriver === drivers[index].id ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                                }`}
                                onClick={() => fetchDriverHistory(drivers[index].id)}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="truncate">{entry.value}</span>
                                <span className="text-zinc-500 whitespace-nowrap">
                                  ({entry.payload.percentage}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-center text-zinc-500">
                  Total Points: {drivers.reduce((sum, driver) => sum + driver.points, 0)}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="constructors">
          <Card className="p-4 md:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Wins</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constructors.map((constructor) => (
                  <TableRow key={constructor.id}>
                    <TableCell>{constructor.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: constructor.color }}
                        />
                        <span>{constructor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{constructor.points}</TableCell>
                    <TableCell className="text-right">{constructor.wins}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Points Distribution</h3>
                  <div className={`${chartContainerStyle} h-[250px] md:h-[300px]`}>
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                      <PieChart>
                        <Pie
                          data={constructors}
                          dataKey="points"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius="45%"
                          outerRadius="80%"
                          paddingAngle={2}
                          label={({ name, percent }) => 
                            window.innerWidth > 640 ? 
                              `${name} (${(percent * 100).toFixed(1)}%)` : 
                              `${(percent * 100).toFixed(1)}%`
                          }
                          labelLine={window.innerWidth > 640}
                        >
                          {constructors.map((constructor) => (
                            <Cell key={constructor.id} fill={constructor.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend 
                          layout={window.innerWidth > 640 ? "horizontal" : "vertical"}
                          verticalAlign={window.innerWidth > 640 ? "bottom" : "middle"}
                          align={window.innerWidth > 640 ? "center" : "right"}
                          wrapperStyle={{
                            fontSize: '12px',
                            paddingLeft: window.innerWidth > 640 ? '0' : '20px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Wins Comparison</h3>
                  <div className={`${chartContainerStyle} h-[250px] md:h-[300px]`}>
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                      <BarChart 
                        data={constructors}
                        margin={{ 
                          top: 20, 
                          right: 10, 
                          left: 0, 
                          bottom: window.innerWidth > 640 ? 60 : 90
                        }}
                      >
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={window.innerWidth > 640 ? 60 : 90}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar 
                          dataKey="wins"
                          maxBarSize={window.innerWidth > 640 ? 60 : 40}
                        >
                          {constructors.map((constructor) => (
                            <Cell key={constructor.id} fill={constructor.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="lastrace">
          <Card className="p-4 md:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Grid</TableHead>
                  <TableHead>Time/Status</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastRace.map((result) => (
                  <TableRow key={result.driver.id}>
                    <TableCell>{result.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono hidden md:inline">{result.driver.number}</span>
                        <span>{result.driver.firstName} {result.driver.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 md:w-3 md:h-3 rounded-full" 
                          style={{ backgroundColor: result.driver.team.color }}
                        />
                        <span className="hidden md:inline">{result.driver.team.name}</span>
                        <span className="md:hidden">{result.driver.team.name.split(' ')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {result.grid < result.position && '↓'}
                        {result.grid > result.position && '↑'}
                        {result.grid}
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.time ? result.time.display : result.status}
                    </TableCell>
                    <TableCell>
                      {result.fastestLap && (
                        <div className="text-xs text-purple-500">
                          FL: {result.fastestLap.time}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Position Changes</h3>
              <div className={`${chartContainerStyle} h-[250px] md:h-[300px]`}>
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <BarChart 
                    data={lastRace.map(result => ({
                      name: `${result.driver.firstName} ${result.driver.lastName}`,
                      team: result.driver.team,
                      positionChange: Number(result.grid) - Number(result.position)
                    }))}
                    margin={{ 
                      top: 20, 
                      right: 10, 
                      left: 0, 
                      bottom: window.innerWidth > 640 ? 60 : 90 
                    }}
                  >
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={window.innerWidth > 640 ? 60 : 90}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: '', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: 12 },
                        offset: 0
                      }}
                    />
                    <Tooltip 
                      contentStyle={tooltipStyle} 
                      formatter={(value: any) => [
                        <span key="value" className="text-white">
                          {Number(value) > 0 ? `+${value}` : value} positions
                        </span>,
                        <span key="label" className="text-white">Positions Changed</span>
                      ]}
                      labelStyle={{ color: 'white' }}
                      labelFormatter={(name: string) => (
                        <span className="text-white font-medium">{name}</span>
                      )}
                    />
                    <Bar 
                      dataKey="positionChange"
                      maxBarSize={window.innerWidth > 640 ? 60 : 40}
                    >
                      {lastRace.map((result) => (
                        <Cell 
                          key={result.driver.id} 
                          fill={Number(result.grid) - Number(result.position) > 0 ? '#22c55e' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="qualifying">
          <Card className="p-4 md:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Q1</TableHead>
                  <TableHead>Q2</TableHead>
                  <TableHead>Q3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifyingResults.map((result) => (
                  <TableRow key={result.driver.id}>
                    <TableCell>{result.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono hidden md:inline">{result.driver.number}</span>
                        <span>{result.driver.firstName} {result.driver.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 md:w-3 md:h-3 rounded-full" 
                          style={{ backgroundColor: result.driver.team.color }}
                        />
                        <span className="hidden md:inline">{result.driver.team.name}</span>
                        <span className="md:hidden">{result.driver.team.name.split(' ')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell>{result.q1Time}</TableCell>
                    <TableCell>{result.q2Time}</TableCell>
                    <TableCell>{result.q3Time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Q3 Times Comparison</h3>
              <div className={`${chartContainerStyle} h-[250px] md:h-[300px]`}>
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <BarChart 
                    data={qualifyingResults
                      .filter(result => result.q3Time)
                      .map(result => ({
                        name: `${result.driver.firstName} ${result.driver.lastName}`,
                        team: result.driver.team,
                        q3Seconds: result.q3Time ? 
                          Number(result.q3Time.split(':')[1]) : 
                          0
                      }))
                      .sort((a, b) => a.q3Seconds - b.q3Seconds)
                    }
                    margin={{ 
                      top: 20, 
                      right: 10, 
                      left: 0, 
                      bottom: window.innerWidth > 640 ? 60 : 90 
                    }}
                  >
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={window.innerWidth > 640 ? 60 : 90}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                      label={{ 
                        value: '', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: 12 },
                        offset: 0
                      }}
                    />
                    <Tooltip 
                      contentStyle={tooltipStyle}
                      formatter={(value: any) => [
                        <span key="value" className="text-white">
                          {value.toFixed(3)}s
                        </span>,
                        <span key="label" className="text-white">Q3 Time</span>
                      ]}
                      labelStyle={{ color: 'white' }}
                      labelFormatter={(name: string) => (
                        <span className="text-white font-medium">{name}</span>
                      )}
                    />
                    <Bar 
                      dataKey="q3Seconds"
                      maxBarSize={window.innerWidth > 640 ? 60 : 40}
                    >
                      {qualifyingResults.map((result) => (
                        <Cell 
                          key={result.driver.id} 
                          fill={result.driver.team.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 