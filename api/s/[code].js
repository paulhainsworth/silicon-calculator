// API route to redirect short URLs
// GET /api/s/[code]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get code from query params
    // Vercel passes dynamic route params in req.query
    // For file api/s/[code].js, the param is available as req.query.code
    const code = req.query.code;

    if (!code || typeof code !== 'string') {
      console.error('Missing or invalid code. Query:', JSON.stringify(req.query), 'URL:', req.url);
      return res.status(400).json({ 
        error: 'Invalid code', 
        received: req.query,
        url: req.url,
        method: req.method
      });
    }

    // Retrieve the full URL from storage
    // For production, use Vercel KV:
    // const stored = await kv.get(`short:${code}`);
    // const fullURL = stored.url;
    
    // Simple in-memory storage lookup
    // NOTE: This storage is reset on each serverless function restart/deployment
    // For production, use Vercel KV for persistent storage
    if (!global.urlStore) {
      console.error('URL store not initialized. Code:', code);
      return res.status(404).json({ 
        error: 'URL not found - storage not available',
        note: 'In-memory storage resets on deployment. Use Vercel KV for persistence.'
      });
    }
    
    const stored = global.urlStore.get(code);

    if (!stored) {
      console.error('Code not found in store:', code, 'Available codes:', Array.from(global.urlStore.keys()));
      return res.status(404).json({ 
        error: 'URL not found or expired',
        note: 'Short URLs are stored in memory and reset on deployment. The URL may have expired.'
      });
    }
    
    // Handle both old format (string) and new format (object)
    const fullURL = typeof stored === 'string' ? stored : stored.url;

    // Get the base URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseURL = `${protocol}://${host}`;
    
    // Remove /api/s from the base URL to get the actual site URL
    const siteURL = baseURL.replace('/api', '');
    
    // Redirect to the full URL (fullURL already includes the ?)
    return res.redirect(302, `${siteURL}${fullURL}`);
  } catch (error) {
    console.error('Error redirecting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

