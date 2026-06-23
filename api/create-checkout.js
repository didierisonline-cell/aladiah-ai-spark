export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });

  // These are the SERVER-SIDE (non-VITE) vars the proxy needs to reach Supabase.
  const SUPABASE_URL = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim();

  const missing = [];
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
  if (missing.length) {
    console.error('[api/create-checkout] PROXY_ENV_MISSING', missing);
    return res.status(500).json({
      error: 'Checkout proxy is missing server env vars',
      code: 'PROXY_ENV_MISSING',
      missing,
    });
  }

  const upstream = `${SUPABASE_URL}/functions/v1/create-checkout`;
  try {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON usually means the edge function isn't deployed (404 HTML) or crashed.
      data = { error: 'Upstream returned non-JSON', code: 'UPSTREAM_BAD_RESPONSE', raw: text.slice(0, 500) };
    }

    if (!response.ok) {
      console.error('[api/create-checkout] upstream error', {
        status: response.status, code: data?.code, error: data?.error,
      });
    }
    // Pass the edge function's status + structured body straight through, so the
    // client/Network tab sees the real `code` (STRIPE_NOT_CONFIGURED, UNKNOWN_PRICE_ID, …).
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[api/create-checkout] UPSTREAM_UNREACHABLE', { upstream, message: error?.message });
    return res.status(502).json({ error: 'Checkout service unreachable', code: 'UPSTREAM_UNREACHABLE' });
  }
}
