import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 4 Dominican professors with distinct personalities
const professors = [
  {
    id: "professor_miguel",
    name: "Professor Miguel Santos",
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // George - warm, authoritative
    personality: "Warm and encouraging, uses Dominican expressions, often says '¡Mira!' and 'Tú sabes'",
    style: "Speaks with passion about Scrum, loves sports analogies especially baseball"
  },
  {
    id: "professor_carmen",
    name: "Profesora Carmen Valdez",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - clear, professional
    personality: "Sharp wit, practical examples, occasionally teases students kindly",
    style: "Uses real-world Dominican business examples, loves merengue metaphors for teamwork"
  },
  {
    id: "professor_rafael",
    name: "Professor Rafael Jiménez",
    voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel - energetic
    personality: "Energetic and humorous, tells jokes, uses 'manito' and '¡Dimelo!' frequently",
    style: "High energy, uses funny stories to explain concepts, references Dominican culture"
  },
  {
    id: "professor_lucia",
    name: "Profesora Lucía Fernández",
    voiceId: "pFZP5JQG7iQjIQuC4Bku", // Lily - warm, friendly
    personality: "Motherly wisdom, patient explanations, uses 'mi amor' and 'mijo/mija'",
    style: "Storytelling approach, connects Scrum to family and community values"
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, lessonTitle, lessonContent, professorIndex } = await req.json();
    
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const professor = professors[professorIndex % professors.length];
    
    // Generate the lesson script
    const script = generateLessonScript(lessonTitle, lessonContent, professor);
    
    // Generate audio using ElevenLabs TTS
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${professor.voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs API error: ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Encode to base64 for response
    const base64Audio = btoa(
      new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return new Response(
      JSON.stringify({
        success: true,
        audioBase64: base64Audio,
        professor: {
          name: professor.name,
          id: professor.id,
        },
        script: script,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error generating audio:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateLessonScript(title: string, content: any, professor: any): string {
  const greetings = [
    `¡Hola, qué lo que! Welcome back to Aladiah Academy. I'm ${professor.name}, and today we're diving into something really exciting.`,
    `¡Dimelo! What's up everyone? ${professor.name} here, ready to drop some knowledge on you today.`,
    `¡Mira! Welcome, welcome! It's ${professor.name}, and I'm so happy to see you all here again.`,
    `¡Wepa! How are we doing today? ${professor.name} at your service, ready to make you a Scrum Master extraordinaire!`,
  ];

  const transitions = [
    "Now, this is where it gets really interesting, tú sabes...",
    "Pay attention to this part, porque this is going to be on the exam, manito!",
    "Let me tell you something, mi gente...",
    "Here's where the magic happens, ¡de verdad!",
  ];

  const jokes = [
    "You know, my abuela used to say, 'Mijo, if you can organize a family sancocho for 30 people, you can be a Scrum Master!' And you know what? She wasn't wrong!",
    "This is like dominoes, my friend. You need strategy, you need teamwork, and you definitely need to know when to pass!",
    "In the DR, we say 'el que mucho abarca, poco aprieta' - and that's basically the Sprint Backlog in a nutshell!",
    "My cousin thought Scrum was a new bachata dance move. ¡Imagínate! But honestly, coordinating a Sprint is like leading a dance - everyone needs to know the steps!",
  ];

  const closings = [
    "And that's the lesson for today, mi gente! Remember, practice makes perfect. ¡Nos vemos pronto!",
    "That's a wrap, manito! Now go out there and be the Scrum Master your team deserves. ¡Pa'lante siempre!",
    "Alright, that's all for now. Keep studying, keep practicing, and remember - you got this! ¡Bendiciones!",
    "We made it through another lesson! Give yourself a pat on the back. ¡Hasta la próxima!",
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  const randomClosing = closings[Math.floor(Math.random() * closings.length)];

  // Build the script based on the lesson content
  let script = `${randomGreeting}\n\n`;
  script += `Today's lesson is all about "${title}". ${randomJoke}\n\n`;
  
  if (typeof content === 'string') {
    script += `${content}\n\n`;
  } else if (content.mainPoints) {
    script += `Let me break this down for you. ${randomTransition}\n\n`;
    content.mainPoints.forEach((point: string, index: number) => {
      script += `Point number ${index + 1}: ${point}\n\n`;
    });
  }

  script += `${randomClosing}`;

  return script;
}
