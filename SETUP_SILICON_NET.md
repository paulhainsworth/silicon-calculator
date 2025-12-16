# Setting Up Calculator at silicon.net/calculator

Since `silicon.net` is hosted elsewhere (not on Vercel), here are your options:

## Option 1: Subdomain (Easiest) - calculator.silicon.net

### Steps:
1. **In Vercel Dashboard:**
   - Go to **silicon-calculator** project → **Settings** → **Domains**
   - Add domain: `calculator.silicon.net`

2. **In Your DNS Provider:**
   - Add a CNAME record:
     - Name: `calculator`
     - Value: `cname.vercel-dns.com` (or the value Vercel provides)

3. **Result:**
   - Calculator lives at: `https://calculator.silicon.net`
   - No conflicts with main site
   - Simple setup

## Option 2: Path-Based - silicon.net/calculator

This requires your main `silicon.net` site to proxy requests to Vercel.

### Steps:

1. **Add Domain to Vercel:**
   - Go to **silicon-calculator** project → **Settings** → **Domains**
   - Add domain: `silicon.net`
   - Vercel will provide DNS records

2. **Configure Your Main Site to Proxy:**
   
   **If using Nginx:**
   ```nginx
   location /calculator {
       proxy_pass https://silicon-calculator.vercel.app;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }
   ```
   
   **If using Apache:**
   ```apache
   ProxyPass /calculator https://silicon-calculator.vercel.app
   ProxyPassReverse /calculator https://silicon-calculator.vercel.app
   ```
   
   **If using Cloudflare/other CDN:**
   - Set up a page rule or worker to proxy `/calculator` to Vercel

3. **DNS Configuration:**
   - Keep your main site's DNS as is
   - Vercel will provide additional records (you may not need to change DNS if using proxy)

### Alternative: Use Vercel for Entire Domain

If you want to move `silicon.net` entirely to Vercel:
1. Add `silicon.net` to this project (or create a monorepo)
2. Configure routes so `/calculator` serves the calculator
3. Other routes can serve your main site
4. Update DNS to point to Vercel

## Recommendation

**Use Option 1 (calculator.silicon.net)** - It's simpler and avoids conflicts.

If you specifically need `/calculator` path, use Option 2 with a proxy setup.






