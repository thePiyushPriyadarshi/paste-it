import { connectRedis, redisClient } from "@/config/redis";
import { NextRequest, NextResponse } from "next/server";

// Constants for configuration
const PASTE_EXPIRY_TIME = 24 * 60 * 60; // 24 hours in seconds
const MAX_PASTE_SIZE = 1024 * 1024; // 1MB limit for paste
const MAX_RETRIES = 3; // Maximum retries for generating unique code

// Function to generate random alphanumeric code
function generateUniqueCode(length: number = 4): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    // Input validation
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > MAX_PASTE_SIZE) {
      return NextResponse.json({ 
        error: 'Text exceeds maximum allowed size' 
      }, { status: 413 });
    }

    await connectRedis();

    // Generate unique code with collision handling
    let pasteCode: string;
    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
      pasteCode = generateUniqueCode();
      const exists = await redisClient.exists(pasteCode);
      
      if (!exists) {
        // Store paste with metadata
        const pasteData = JSON.stringify({
          text,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + PASTE_EXPIRY_TIME * 1000).toISOString()
        });

        // Set the paste with expiration
        await redisClient.setEx(pasteCode, PASTE_EXPIRY_TIME, pasteData);

        console.log(`Paste created: ${pasteCode}, expires in ${PASTE_EXPIRY_TIME} seconds`);

        return NextResponse.json({ 
          message: 'Text saved successfully',
          code: pasteCode, 
          expiresAt: new Date(Date.now() + PASTE_EXPIRY_TIME * 1000).toISOString()
        }, { status: 201 });
      }
      attempts++;
    }

    return NextResponse.json({ 
      error: 'Failed to generate unique code, please try again' 
    }, { status: 409 });

  } catch (error) {
    console.error('Paste creation error:', error);
    return NextResponse.json({ 
      error: 'Server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract code from query params
    const code = request.nextUrl.searchParams.get("code")?.toUpperCase();

    // Validate code format
    if (!code || !/^[A-Z2-9]{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid paste code format" },
        { status: 400 }
      );
    }

    await connectRedis();

    // Fetch paste data from Redis
    const pasteData = await redisClient.get(code);

    if (!pasteData) {
      return NextResponse.json(
        { error: "Code Paste not found or expired" },
        { status: 404 }
      );
    }

    // Parse stored JSON
    const paste = JSON.parse(pasteData);
    return NextResponse.json(
      {
        code,
        ...paste,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}