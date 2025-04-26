import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = "http://api.jolpi.ca/ergast/f1";

export async function GET(request: NextRequest) {
  try {
    // Get the path from the URL
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    // Make the request to the Jolpica API
    const response = await fetch(`${BASE_URL}${path}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('F1 API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch F1 data' },
      { status: 500 }
    );
  }
} 