# Portfolio Website

A modern portfolio website built with Next.js, featuring F1 statistics, Spotify integration, and more.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Environment Variables

Before running the application, you need to set up your environment variables. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then, fill in your actual values in `.env.local`:

- **Spotify API Credentials**
  - `SPOTIFY_CLIENT_ID`: Your Spotify application client ID
  - `SPOTIFY_CLIENT_SECRET`: Your Spotify application client secret
  - `SPOTIFY_REFRESH_TOKEN`: Your Spotify refresh token

- **F1 API Credentials**
  - `RAPIDAPI_KEY`: Your RapidAPI key
  - `RAPIDAPI_HOST`: The API host for Formula 1 data

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
