// API route to redirect short URLs
// GET /api/[code]

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
    // const fullURL = await kv.get(`short:${code}`);
    
    // Simple in-memory storage lookup
    if (!global.urlStore) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    const fullURL = global.urlStore.get(code);

    if (!fullURL) {
      return res.status(404).json({ error: 'URL not found or expired' });
    }

    // Get the base URL
    const baseURL = req.headers['x-forwarded-proto'] 
      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host'] || req.headers.host}`
      : `https://${req.headers.host}`;
    
    // Remove /api from the base URL to get the actual site URL
    const siteURL = baseURL.replace('/api', '');
    
    // Redirect to the full URL
    return res.redirect(302, `${siteURL}${fullURL}`);
  } catch (error) {
    console.error('Error redirecting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

