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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

### Environment Variables in Vercel

Make sure to add all the environment variables from your `.env.local` file to your Vercel project:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add each variable from your `.env.local` file

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Platform](https://vercel.com)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Formula 1 API Documentation](https://rapidapi.com/api-sports/api/api-formula-1)

<div align="center">
    <a href="https://chronark.com"><h1 align="center">chronark.com</h1></a>

My personal website, built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Upstash](https://upstash.com?ref=chronark.com), [Contentlayer](https://www.contentlayer.dev/) and deployed to [Vercel](https://vercel.com/).

</div>

<br/>


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/upstash/clone?demo-title=Next.js%20Portfolio%20with%20Pageview%20Counter&demo-description=Portfolio%20site%20with%20pageview%20counter%2C%20built%20with%20Next.js%2013%20App%20Router%2C%20Contentlayer%2C%20and%20Upstash%20Redis.&demo-url=https%3A%2F%2Fchronark.com%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1DA8n5a6WaP9p1FXf9LmUY%2Fc6264fa2732355787bf657df92dda8a1%2FCleanShot_2023-04-17_at_14.17.37.png&project-name=Next.js%20Portfolio%20with%20Pageview%20Counter&repository-name=nextjs-portfolio-pageview-counter&repository-url=https%3A%2F%2Fgithub.com%2Fchronark%2Fchronark.com&from=templates&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17)

## Running Locally


```sh-session
git clone https://github.com/chronark/chronark.com.git
cd chronark.com
```


Create a `.env` file similar to [`.env.example`](https://github.com/chronark/chronark.com/blob/main/.env.example).

Then install dependencies and run the development server:
```sh-session
pnpm install
pnpm dev
```


## Cloning / Forking

Please remove all of my personal information (projects, images, etc.) before deploying your own version of this site.
