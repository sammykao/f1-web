import { NextRequest, NextResponse } from 'next/server';

const EC2_BASE_URL = "http://ec2-54-91-100-129.compute-1.amazonaws.com";
const RESEARCH_PORT = 8000;
const RESOURCES_PORT = 10000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const port = searchParams.get('port');
  
  if (!port || (port !== '8000' && port !== '10000')) {
    return NextResponse.json({ error: 'Invalid port parameter' }, { status: 400 });
  }

  const targetPort = port === '8000' ? RESEARCH_PORT : RESOURCES_PORT;
  const url = `${EC2_BASE_URL}:${targetPort}/health`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Health check failed for port ${targetPort}:`, error);
    return NextResponse.json(
      { 
        error: 'Health check failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        port: targetPort 
      }, 
      { status: 500 }
    );
  }
} 