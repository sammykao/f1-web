"use client";

import { useEffect, useState } from "react";
import { f1Client, type F1Circuit, type F1StartingGrid, type F1FastestLap, type F1PitStop } from "../lib/f1";
import { Card } from "./card";
import Image from "next/image";

export interface F1RaceWeekendProps {
  raceId: number;
  season: number;
}

export function F1RaceWeekend({ raceId, season }: F1RaceWeekendProps) {
  const [circuit, setCircuit] = useState<F1Circuit | null>(null);
  const [startingGrid, setStartingGrid] = useState<F1StartingGrid[]>([]);
  const [fastestLaps, setFastestLaps] = useState<F1FastestLap[]>([]);
  const [pitStops, setPitStops] = useState<F1PitStop[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRaceData() {
      try {
        // Fetch circuit data for the season
        const circuits = await f1Client.getCircuits(season);
        const currentCircuit = circuits[0]; // You might need logic to find the specific circuit
        setCircuit(currentCircuit);

        // Fetch race weekend data
        const [gridData, lapsData, pitsData] = await Promise.all([
          f1Client.getStartingGridRankings(raceId),
          f1Client.getFastestLapRankings(raceId),
          f1Client.getPitStops(raceId),
        ]);

        setStartingGrid(gridData);
        setFastestLaps(lapsData);
        setPitStops(pitsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch race data");
      }
    }

    fetchRaceData();
  }, [raceId, season]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Circuit Information */}
      {circuit && (
        <Card>
          <div className="flex items-start gap-6">
            <div className="flex-none w-48 h-32 relative rounded-lg overflow-hidden">
              <Image
                src={circuit.image}
                alt={circuit.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2">{circuit.name}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-400">Location</p>
                  <p>{circuit.competition.location.city}, {circuit.competition.location.country}</p>
                </div>
                <div>
                  <p className="text-zinc-400">First Grand Prix</p>
                  <p>{circuit.first_grand_prix}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Circuit Length</p>
                  <p>{circuit.length}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Race Distance</p>
                  <p>{circuit.race_distance}</p>
                </div>
              </div>
              {circuit.lap_record && (
                <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
                  <p className="text-sm text-zinc-400">Lap Record</p>
                  <p className="font-mono">{circuit.lap_record.time}</p>
                  <p className="text-sm">{circuit.lap_record.driver} ({circuit.lap_record.year})</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Starting Grid */}
      <Card>
        <h3 className="text-2xl font-bold mb-6">Starting Grid</h3>
        <div className="space-y-2">
          {startingGrid.map((position) => (
            <div
              key={position.position}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/30"
            >
              <div className="flex-none w-8 text-center font-mono">
                {position.position}
              </div>
              <div className="flex-none w-8 h-8 relative">
                <Image
                  src={position.team.logo}
                  alt={position.team.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{position.driver.name}</span>
                  <span className="text-sm text-zinc-400">{position.driver.abbr}</span>
                </div>
                <div className="text-sm text-zinc-400">{position.team.name}</div>
              </div>
              <div className="flex-none font-mono text-sm">
                {position.time}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fastest Laps */}
      <Card>
        <h3 className="text-2xl font-bold mb-6">Fastest Laps</h3>
        <div className="space-y-2">
          {fastestLaps.map((lap) => (
            <div
              key={lap.position}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/30"
            >
              <div className="flex-none w-8 text-center font-mono">
                {lap.position}
              </div>
              <div className="flex-none w-8 h-8 relative">
                <Image
                  src={lap.team.logo}
                  alt={lap.team.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{lap.driver.name}</span>
                  <span className="text-sm text-zinc-400">{lap.driver.abbr}</span>
                </div>
                <div className="text-sm text-zinc-400">{lap.team.name}</div>
              </div>
              <div className="flex-none font-mono text-sm">
                {lap.time}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pit Stops */}
      <Card>
        <h3 className="text-2xl font-bold mb-6">Pit Stops</h3>
        <div className="space-y-2">
          {pitStops.map((stop, index) => (
            <div
              key={`${stop.driver.id}-${stop.stop}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/30"
            >
              <div className="flex-none w-8 text-center">
                <div className="font-mono">{stop.stop}</div>
                <div className="text-xs text-zinc-400">STOP</div>
              </div>
              <div className="flex-none w-8 h-8 relative">
                <Image
                  src={stop.team.logo}
                  alt={stop.team.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{stop.driver.name}</span>
                  <span className="text-sm text-zinc-400">{stop.driver.abbr}</span>
                </div>
                <div className="text-sm text-zinc-400">
                  Lap {stop.lap} · {stop.team.name}
                </div>
              </div>
              <div className="flex-none text-right">
                <div className="font-mono text-sm">{stop.time}</div>
                <div className="text-xs text-zinc-400">Total: {stop.total_time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 