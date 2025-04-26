import React from "react";
import { Navigation } from "../components/nav";
import { F1Stats } from "../components/f1-stats";
import { Card } from "../components/card";

export const revalidate = 10; // Revalidate every 10 seconds

export default async function VroomPage() {
  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl flex items-center gap-4">
            <span>Formula 1 Tracker</span>
            <span className="text-4xl animate-pulse">🏎️</span>
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            My own little F1 Dashboard
          </p>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8">

          <div className="relative">
            <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-zinc-800/50 rounded-2xl" />
            <div className="relative z-10">
              <F1Stats />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        <div className="max-w-2xl mx-auto lg:mx-0">
          <p className="text-sm text-zinc-400">
            Data provided by OpenF1 API. Updates automatically during race weekends.
            Times shown in your local timezone.
          </p>
        </div>
      </div>
    </div>
  );
} 