// Shared email utility using Resend API
// All email functions import from here for consistent branding

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Aladiah Academy <noreply@aladiahacademy.com>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://aladiahacademy.com";

export async function sendEmail(to: string, subject: string, htmlBody: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email not sent to", to);
    console.log("Subject:", subject);
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html: htmlBody,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Resend error:", data);
    return { success: false, error: data };
  }
  return { success: true, id: data.id };
}

export function emailWrapper(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0;">
        <span style="color:#3b82f6;">Aladiah</span> Academy
      </h1>
    </div>
    <!-- Card -->
    <div style="background:#111827;border:1px solid rgba(59,130,246,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">
      <h2 style="color:#fff;font-size:20px;font-weight:700;margin:0 0 16px;">${title}</h2>
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;">
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
        Aladiah Academy — AI-Powered Professional Training<br>
        <a href="${SITE_URL}" style="color:#3b82f6;text-decoration:none;">aladiahacademy.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function btnHtml(text: string, url: string, color = "#3b82f6"): string {
  return `<a href="${url}" style="display:inline-block;padding:12px 28px;background:${color};color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;margin:8px 0;">${text}</a>`;
}

export { SITE_URL };
