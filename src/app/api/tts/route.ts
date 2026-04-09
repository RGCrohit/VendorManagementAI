import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    // Using a professional female voice (Rachel)
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; 
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.warn("ElevenLabs API Key is missing");
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("ElevenLabs Error:", errText);
        return NextResponse.json({ error: "TTS request failed" }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
     console.error("TTS Route Error:", error);
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
