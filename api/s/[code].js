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

    // Retrieve the full URL from storage (Vercel KV with fallback to in-memory)
    let stored = null;
    
    try {
      // Try to use Vercel KV first
      if (process.env.KV_REST_API_URL) {
        const storedJson = await kv.get(`short:${code}`);
        if (storedJson) {
          stored = JSON.parse(storedJson);
        }
      }
    } catch (kvError) {
      console.error('KV retrieval error, trying fallback:', kvError);
    }
    
    // Fallback to in-memory storage if KV not available or failed
    if (!stored && global.urlStore) {
      stored = global.urlStore.get(code);
    }

    if (!stored) {
      console.error('Code not found:', code);
      return res.status(404).json({ 
        error: 'URL not found or expired',
        note: 'The short URL may have expired or was not found. Short URLs expire after 7 days.'
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

