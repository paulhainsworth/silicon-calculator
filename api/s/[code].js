// API route to redirect short URLs
// GET /api/s/[code]

import { kv } from '@vercel/kv';

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

    // Retrieve the full URL from Vercel KV (REQUIRED for persistence)
    let stored = null;
    
    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      console.error('Vercel KV not configured for retrieval');
      return res.status(503).json({ 
        error: 'URL service unavailable',
        message: 'Vercel KV is not configured. Please set up Vercel KV (Upstash Redis) in your Vercel dashboard.',
        setupInstructions: 'Go to Vercel Dashboard → Storage → Create KV database (Upstash Redis) → Link to this project'
      });
    }
    
    try {
      // Retrieve from Vercel KV
      const storedJson = await kv.get(`short:${code}`);
      if (storedJson) {
        stored = typeof storedJson === 'string' ? JSON.parse(storedJson) : storedJson;
        console.log(`Successfully retrieved short URL: ${code} from KV`);
      }
    } catch (kvError) {
      console.error('KV retrieval error:', kvError);
      return res.status(500).json({ 
        error: 'Failed to retrieve URL',
        message: 'Could not access Vercel KV. Please check your KV configuration.',
        details: kvError.message
      });
    }

    if (!stored) {
      console.error('Code not found in KV:', code);
      return res.status(404).json({ 
        error: 'URL not found or expired',
        note: 'The short URL may have expired (7 days) or was not found in storage.',
        code
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

