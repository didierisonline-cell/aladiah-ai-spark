import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

serve(async (req) => {
  if (req.method==="OPTIONS") return new Response("ok",{headers:cors});
  try {
    const { lessonTitle, lessonDescription, courseTitle } = await req.json();
    const key = Deno.env.get("ANTHROPIC_API_KEY")||"";
    const prompt = `Create 2 professional educational SVG diagrams. Course: ${courseTitle}. Lesson: ${lessonTitle}. Description: ${lessonDescription||''}. Return JSON array: ["<svg viewBox='0 0 700 380' xmlns='http://www.w3.org/2000/svg'>...</svg>","<svg viewBox='0 0 700 380' xmlns='http://www.w3.org/2000/svg'>...</svg>"]. White bg, dark text #1e293b, blue #1d4ed8, professional O-Reilly style, technically accurate, clear title and labels.`;
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:4000,system:"Return ONLY a valid JSON array of 2 SVG strings. No markdown.",messages:[{role:"user",content:prompt}]})
    });
    const d = await r.json();
    let t = (d.content?.[0]?.text||"[]").trim().replace(/^```[\w]*\n?/,"").replace(/```$/,"");
    const svgs = JSON.parse(t);
    return new Response(JSON.stringify({svgs}),{headers:{...cors,"Content-Type":"application/json"}});
  } catch(e) {
    return new Response(JSON.stringify({error:String(e),svgs:[]}),{status:200,headers:{...cors,"Content-Type":"application/json"}});
  }
});
