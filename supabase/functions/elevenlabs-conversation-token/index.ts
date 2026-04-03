import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// LaSean Pickens for EN/ES, deep native voices for other languages
const VOICE_BY_LANG: Record<string, string> = {
  en: "bQxW1c7YCr6VQgQhw8KX", // LaSean Pickens clone
  es: "bQxW1c7YCr6VQgQhw8KX", // LaSean Pickens clone
  fr: "IBGoh6rlxdauchOCULhL", // Bellami - Deep & Resonant (French)
  de: "WPbK7Qv9rbyhvUDiwJ0A", // Hans - Deep & Dominant (German)
  zh: "pU9NaAwkoR3v0Mrg3uKz", // Haoran - Deep, Calm & Steady (Chinese)
  ar: "Ojb0nFbyzZn95u0i5a5p", // Marco Nady - Confident & Deep (Arabic)
  ja: "Mv8AjrYZCBkdsmDHNwcB", // Ishibashi - Deep & Strong (Japanese)
  ko: "ibCGc01503OQd2R6i1n1", // Marcus - Baritone Stoic (Korean)
  it: "F9w7aaEjfT09qV89OdY8", // Adam - Deep & Encouraging (Italian)
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const AGENT_ID = Deno.env.get("ELEVENLABS_AGENT_ID");
    if (!AGENT_ID) {
      throw new Error("ELEVENLABS_AGENT_ID is not configured.");
    }

    // Accept language from the frontend to select the right voice
    let language = "en";
    try {
      const body = await req.json();
      if (body.language) language = body.language;
    } catch {
      // No body or not JSON — default to English
    }

    const voiceId = VOICE_BY_LANG[language] || VOICE_BY_LANG.en;
    const isNonEnglish = language !== "en" && language !== "es";

    // Use the signed URL endpoint so we can bake voice overrides into the token
    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url",
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: AGENT_ID,
          conversation_config_override: {
            agent: {
              language: language,
            },
            tts: {
              voice_id: voiceId,
              stability: 0.71,
              similarity_boost: isNonEnglish ? 0.55 : 0.65,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs signed URL error:", response.status, errorText);

      // Fallback to simple token endpoint (no overrides)
      console.log("Falling back to simple token endpoint...");
      const fallbackRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`,
        { headers: { "xi-api-key": ELEVENLABS_API_KEY } }
      );
      if (!fallbackRes.ok) {
        throw new Error(`Failed to get conversation token: ${fallbackRes.status}`);
      }
      const { token } = await fallbackRes.json();
      return new Response(JSON.stringify({ token }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    // The signed URL endpoint returns { signed_url } instead of { token }
    return new Response(JSON.stringify({
      signed_url: data.signed_url,
      token: data.token,  // include token if returned
      voice_id: voiceId,
      language,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("elevenlabs-conversation-token error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
