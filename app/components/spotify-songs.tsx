import { Card, CardTitle } from "./card";
import Image from "next/image";

export interface Song {
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt?: string;
}

export function SpotifySong({ song }: { song: Song }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to EST
    const estOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'America/New_York',
      month: 'numeric' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
      hour: 'numeric' as const,
      minute: '2-digit' as const,
      hour12: true
    };
    
    return new Intl.DateTimeFormat('en-US', estOptions).format(date) + ' EST';
  };

  return (
    <Card className="group hover:bg-zinc-800/50 p-2 sm:p-3">
      <a href={song.songUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-4">
        <div className="relative min-w-[48px] w-12 h-12 sm:min-w-[56px] sm:w-14 sm:h-14">
          <Image
            src={song.albumImageUrl}
            alt={`${song.title} album art`}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm sm:text-base truncate">{song.title}</CardTitle>
          <p className="text-xs sm:text-sm text-zinc-400 truncate">{song.artist}</p>
          {song.playedAt && (
            <p className="text-[10px] sm:text-xs text-zinc-500 truncate">
              {formatDate(song.playedAt)}
            </p>
          )}
        </div>
      </a>
    </Card>
  );
}

export function SpotifySongGrid({ songs }: { songs: Song[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
      {songs.map((song, i) => (
        <SpotifySong key={i} song={song} />
      ))}
    </div>
  );
} 