const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=20';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term';

const getAccessToken = async () => {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN!,
    }),
  });

  return response.json();
};

export const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  return data.items.map((track: any) => ({
    title: track.track.name,
    artist: track.track.artists.map((artist: any) => artist.name).join(', '),
    albumImageUrl: track.track.album.images[0].url,
    songUrl: track.track.external_urls.spotify,
    playedAt: track.played_at,
  }));
};

export const getTopTracks = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  return data.items.map((track: any) => ({
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    albumImageUrl: track.album.images[0].url,
    songUrl: track.external_urls.spotify,
  }));
}; 