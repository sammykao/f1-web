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
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return `${date.toLocaleDateString()} ${formattedTime}`;
  };

  return (
    <Card className="group hover:bg-zinc-800/50">
      <a href={song.songUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4">
        <div className="relative min-w-[64px] h-16">
          <Image
            src={song.albumImageUrl}
            alt={`${song.title} album art`}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 truncate">
          <CardTitle className="text-base truncate">{song.title}</CardTitle>
          <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          {song.playedAt && (
            <p className="text-xs text-zinc-500">
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {songs.map((song, i) => (
        <SpotifySong key={i} song={song} />
      ))}
    </div>
  );
} 