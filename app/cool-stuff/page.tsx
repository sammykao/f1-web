import React from "react";
import { Navigation } from "../components/nav";
import { SpotifySongGrid } from "../components/spotify-songs";
import { getRecentlyPlayed, getTopTracks } from "../lib/spotify";

export const revalidate = 60; // Revalidate every minute

export default async function CoolStuffPage() {
  const [recentSongs, topTracks] = await Promise.all([
    getRecentlyPlayed(),
    getTopTracks(),
  ]);

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0 mt-4">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Cool Stuff
          </h2>
          <p className="mt-4 text-zinc-400">
            Check out what I've been listening to lately.
          </p>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        <div className="mx-auto lg:mx-0">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl mb-8">
            Recently Played
          </h3>
          <SpotifySongGrid songs={recentSongs} />
        </div>

        <div className="w-full h-px bg-zinc-800" />

        <div className="mx-auto lg:mx-0">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl mb-8">
            Top Tracks This Month
          </h3>
          <SpotifySongGrid songs={topTracks} />
        </div>
      </div>
    </div>
  );
}
