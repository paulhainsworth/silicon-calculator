# URL Shortener API

This directory contains serverless functions for URL shortening.

## Endpoints

### POST /api/shorten
Creates a short URL from calculator parameters.

**Request:**
```json
{
  "params": {
    "term": "30",
    "servers": "1",
    "unitCost": "100000",
    ...
  }
}
```

**Response:**
```json
{
  "shortURL": "https://your-site.vercel.app/s/abc123",
  "shortCode": "abc123"
}
```

### GET /s/[code]
Redirects to the full URL with parameters.

## Storage

Currently uses in-memory storage (`global.urlStore`), which means:
- URLs are lost when serverless functions restart
- Not suitable for production

### For Production: Use Vercel KV

1. Install Vercel KV:
   ```bash
   npm install @vercel/kv
   ```

2. Set up Vercel KV in your Vercel dashboard

3. Update the API routes to use KV:
   ```javascript
   import { kv } from '@vercel/kv';
   
   // Store
   await kv.set(`short:${shortCode}`, fullURL, { ex: 86400 * 7 }); // 7 days
   
   // Retrieve
   const fullURL = await kv.get(`short:${code}`);
   ```






