export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  const debug = {
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    urlLength: SUPABASE_URL?.length,
    urlStart: SUPABASE_URL?.slice(0, 40),
    urlEnd: SUPABASE_URL?.slice(-10),
    urlHasWhitespace: SUPABASE_URL !== SUPABASE_URL?.trim(),
    targetUrl: `${SUPABASE_URL}/functions/v1/create-checkout`,
  };

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Missing env vars', debug });
  }

  try {
    const cleanUrl = SUPABASE_URL.trim().replace(/\/+$/, '');
    const targetUrl = `${cleanUrl}/functions/v1/create-checkout`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY.trim()}`,
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error.message,
      name: error.name,
      cause: error.cause ? {
        message: error.cause.message,
        code: error.cause.code,
        errno: error.cause.errno,
      } : null,
      debug,
    });
  }
}
