// API route to shorten URLs
// POST /api/shorten

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { params, scenarios } = req.body;

    if (!params || typeof params !== 'object') {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Generate a short code (6-8 characters)
    const shortCode = generateShortCode();
    const fullURL = buildFullURL(params, scenarios);

    // Store the mapping using Vercel KV (REQUIRED for persistence across deployments)
    const storeData = { url: fullURL, scenarios: scenarios || [] };
    
    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      console.error('Vercel KV not configured. KV_REST_API_URL environment variable is missing.');
      return res.status(503).json({ 
        error: 'URL shortening unavailable',
        message: 'Vercel KV is not configured. Please set up Vercel KV (Upstash Redis) in your Vercel dashboard to enable persistent URL storage.',
        setupInstructions: 'Go to Vercel Dashboard → Storage → Create KV database (Upstash Redis) → Link to this project'
      });
    }
    
    try {
      // Store in Vercel KV with 7-day expiry
      await kv.set(`short:${shortCode}`, JSON.stringify(storeData), { ex: 86400 * 7 });
      console.log(`Successfully stored short URL: ${shortCode} in KV`);
    } catch (kvError) {
      console.error('KV storage error:', kvError);
      return res.status(500).json({ 
        error: 'Failed to store URL',
        message: 'Could not save to Vercel KV. Please check your KV configuration.',
        details: kvError.message
      });
    }

    // Return the short URL
    const baseURL = req.headers['x-forwarded-proto'] 
      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host'] || req.headers.host}`
      : `https://${req.headers.host}`;
    
    // Remove /api from base URL if present
    const siteURL = baseURL.replace('/api', '');
    const shortURL = `${siteURL}/s/${shortCode}`;

    return res.status(200).json({ 
      shortURL,
      shortCode 
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function generateShortCode() {
  // Generate a random 6-character code using alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function buildFullURL(params, scenarios = []) {
  // Build the full URL with all parameters
  const paramKeys = [
    'term', 'servers', 'unitCost', 'residual',
    'hourlyRate', 'decay', 'utilization', 'marketRake', 
    'providerRake', 'siliconFee', 'taxRate'
  ];
  
  const urlParams = new URLSearchParams();
  paramKeys.forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      urlParams.set(key, params[key]);
    }
  });
  
  // Add scenarios as JSON-encoded parameter if they exist
  if (scenarios && scenarios.length > 0) {
    urlParams.set('scenarios', JSON.stringify(scenarios));
  }
  
  return `?${urlParams.toString()}`;
}

