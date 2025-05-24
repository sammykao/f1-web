import { NextRequest, NextResponse } from 'next/server';

const OTF_AGENT_URL = process.env.OTF_AGENT_URL;
const CHAT_PASSWORD = process.env.OTF_CHAT_PASSWORD;
if (!OTF_AGENT_URL) {
  throw new Error('OTF_AGENT_URL environment variable is not set');
}
if (!CHAT_PASSWORD) {
  throw new Error('OTF_CHAT_PASSWORD environment variable is not set');
}

export async function POST(request: NextRequest) {
  try {
    const { message, password } = await request.json();
    if (!password || password !== CHAT_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const nowId = Date.now().toString();
    const payload = {
      jsonrpc: '2.0',
      id: nowId,
      method: 'tasks/send',
      params: {
        id: nowId,
        message: {
          role: 'user',
          parts: [
            {
              type: 'text',
              text: message,
            },
          ],
        },
      },
    };

    const response = await fetch(OTF_AGENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('AI Agent Response:', JSON.stringify(data, null, 2));

    // Try to extract the AI's reply from the new response format
    let aiText = 'Sorry, no response.';
    if (data?.result?.artifacts?.[0]?.parts?.[0]?.text) {
      aiText = data.result.artifacts[0].parts[0].text;
    } else if (data?.result?.message?.parts?.[0]?.text) {
      aiText = data.result.message.parts[0].text;
    }

    return NextResponse.json({ aiText, raw: data });
  } catch (error) {
    console.error('OTF Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to contact OTF agent.' }, { status: 500 });
  }
} 