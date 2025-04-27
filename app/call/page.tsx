import { redirect } from 'next/navigation';
import { DailyCall } from '../components/daily-call';

interface Props {
  searchParams: { 
    code?: string 
  }
}

export default async function CallPage({ searchParams }: Props) {
  const { code } = searchParams;
  
  if (!code) {
    redirect('/');
  }

  const apiKey = process.env.DAILY_API_KEY;
  const domain = process.env.DAILY_DOMAIN;

  if (!apiKey) {
    throw new Error('Missing DAILY_API_KEY in environment variables. Get this from your Daily.co dashboard.');
  }

  if (!domain) {
    throw new Error(
      'Missing DAILY_DOMAIN in environment variables. ' +
      'This should be your Daily.co subdomain (e.g., if you access Daily.co at https://mycompany.daily.co, ' +
      'then your domain is mycompany.daily.co). ' +
      'You can find this in your Daily.co dashboard settings.'
    );
  }

  try {
    // First try to get the room
    const response = await fetch(`https://api.daily.co/v1/rooms/${code}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    // If room doesn't exist (404) or other error, create it
    if (!response.ok) {
      console.log(`Room ${code} not found, creating new room...`);
      
      const createResponse = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: code,
          properties: {
            enable_chat: true,
            enable_screenshare: true,
            enable_knocking: false,
            start_video_off: true,
            start_audio_off: false,
          }
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => null);
        console.error('Failed to create room:', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          error: errorData
        });
        throw new Error(`Failed to create room: ${createResponse.statusText}`);
      }

      const roomData = await createResponse.json();
      console.log('Room created successfully:', roomData);
    }

    // The full URL where the video call will be hosted
    const roomUrl = `https://${domain}/${code}`;
    console.log('Joining room at:', roomUrl);

    return (
      <main className="flex min-h-screen flex-col">
        <div className="fixed inset-0">
          <DailyCall roomUrl={roomUrl} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in CallPage:', error);
    throw error;
  }
} 