// API route to shorten URLs
// POST /api/shorten

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

    // Store the mapping
    // For production, use Vercel KV or a database
    // For now, we'll use a simple in-memory cache (not persistent across deployments)
    // In production, replace this with Vercel KV:
    // await kv.set(`short:${shortCode}`, JSON.stringify({ url: fullURL, scenarios }), { ex: 86400 * 7 }); // 7 days expiry
    
    // Simple in-memory storage (will be lost on serverless function restart)
    // This is a temporary solution - for production, use Vercel KV
    if (!global.urlStore) {
      global.urlStore = new Map();
    }
    // Store both URL and scenarios
    global.urlStore.set(shortCode, { url: fullURL, scenarios: scenarios || [] });

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

