// API route to redirect short URLs
// GET /api/s/[code]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // Retrieve the full URL from storage
    // For production, use Vercel KV:
    // const stored = await kv.get(`short:${code}`);
    // const fullURL = stored.url;
    
    // Simple in-memory storage lookup
    if (!global.urlStore) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    const stored = global.urlStore.get(code);

    if (!stored) {
      return res.status(404).json({ error: 'URL not found or expired' });
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

