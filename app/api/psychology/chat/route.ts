import { NextRequest, NextResponse } from 'next/server';

const EC2_BASE_URL = "http://ec2-54-91-100-129.compute-1.amazonaws.com";
const RESEARCH_PORT = 8000;
const RESOURCES_PORT = 10000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, port, resetMemory = false } = body;

    if (!message || !port || (port !== 8000 && port !== 10000)) {
      return NextResponse.json(
        { error: 'Invalid parameters. Message and port (8000 or 10000) are required.' }, 
        { status: 400 }
      );
    }

    const targetPort = port === 8000 ? RESEARCH_PORT : RESOURCES_PORT;
    const url = `${EC2_BASE_URL}:${targetPort}/chat`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        reset_memory: resetMemory
      }),
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout for chat
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat request failed:', error);
    return NextResponse.json(
      { 
        error: 'Chat request failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 