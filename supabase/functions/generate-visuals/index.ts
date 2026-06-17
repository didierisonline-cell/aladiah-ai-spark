import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

serve(async (req) => {
  if (req.method==="OPTIONS") return new Response("ok",{headers:cors});
  try {
    const { lessonTitle, lessonDescription, courseTitle, language } = await req.json();
    const key = Deno.env.get("ANTHROPIC_API_KEY")||"";
    const LANG: Record<string,string> = { en:"English", es:"Spanish", fr:"French", pt:"Portuguese", de:"German", ar:"Arabic", zh:"Chinese (Simplified)", hi:"Hindi" };
    const langName = LANG[language] || "English";
    const langRule = language && language !== 'en'
      ? `\n\nLANGUAGE: Write EVERY diagram text label, title, and annotation in ${langName}. Do NOT use English for any visible label. Keep only protected brand/technical names unchanged: Aladiah, Scrum, AI, Sprint, Kanban, SAFe, Jira, GitHub. ${language==='ar' ? 'This is a Right-To-Left language: set direction="rtl" on <text> and right-anchor labels appropriately.' : ''}`
      : '';
    const prompt = `Create 2 professional educational SVG diagrams. Course: ${courseTitle}. Lesson: ${lessonTitle}. Description: ${lessonDescription||''}.${langRule}

CRITICAL ACCURACY RULES (this is a paid certification course — fabricated facts cause real harm):
- Use ONLY concepts, terms, and facts that appear in the Description above, plus widely-established, non-controversial Scrum framework facts (the 3 accountabilities, 5 events, 3 artifacts, event timeboxes from the Scrum Guide).
- Do NOT invent or include any specific statistics, percentages, salary figures, dollar amounts, dates, company names, or "X% of time" claims unless that exact figure appears verbatim in the Description.
- If the Description has no numbers, the diagrams must have no numbers. Conceptual labels only.
- When in doubt, omit the specific and keep the label conceptual. A clean diagram with no numbers is far better than one with an invented number.

LAYOUT & RENDERING RULES (diagrams must look clean, not broken):
- Keep ALL text fully INSIDE its container shape. Every <text> must sit at least 12px inside the left, right, top, and bottom edges of its box. Never let a label start at or outside a box's left edge.
- Use a viewBox of '0 0 700 500' and keep all content within a 20px margin of every edge — nothing clipped at the frame.
- For text inside boxes, set x to the box's left coordinate PLUS padding (e.g. box at x=60 -> text x=76), and prefer text-anchor='start' with that inset, or text-anchor='middle' centered on the box's center x.
- Keep labels short enough to fit; if a label is long, reduce font-size rather than overflow.
- Leave clear spacing between boxes so nothing overlaps.

Return JSON array: ["<svg viewBox='0 0 700 380' xmlns='http://www.w3.org/2000/svg'>...</svg>","<svg viewBox='0 0 700 380' xmlns='http://www.w3.org/2000/svg'>...</svg>"]. White bg, dark text #1e293b, blue #1d4ed8, professional O-Reilly style, clear title and labels.`;
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
