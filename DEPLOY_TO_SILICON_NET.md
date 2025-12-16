# Deploying Calculator to silicon.net/calculator

## Option 1: Add to Main silicon.net Project (Recommended)

If your main `silicon.net` site is already a Vercel project:

1. **Add Calculator to Main Project:**
   - In your main silicon.net Vercel project, add this calculator code
   - Place it in a `/calculator` folder
   - Update routes to serve it at `/calculator`

2. **Update vercel.json in Main Project:**
   ```json
   {
     "rewrites": [
       {
         "source": "/calculator",
         "destination": "/calculator/index.html"
       },
       {
         "source": "/calculator/s/(.*)",
         "destination": "/calculator/api/s/$1"
       }
     ]
   }
   ```

## Option 2: Deploy as Separate Project with Domain Routing

### Step 1: Add Domain to This Project

1. Go to Vercel Dashboard → **silicon-calculator** project
2. Go to **Settings** → **Domains**
3. Add domain: `silicon.net`
4. Vercel will provide DNS records to add

### Step 2: Configure Path-Based Routing

Update `vercel.json` to handle the `/calculator` path:

```json
{
  "outputDirectory": "public",
  "rewrites": [
    {
      "source": "/calculator",
      "destination": "/index.html"
    },
    {
      "source": "/calculator/s/(.*)",
      "destination": "/api/s/$1"
    }
  ]
}
```

### Step 3: Update Internal Links

Update any internal links in the calculator to use `/calculator` as the base path.

## Option 3: Use Vercel's Path-Based Routing (If Main Site is on Vercel)

If your main silicon.net site is on Vercel:

1. In your **main silicon.net project** settings
2. Add this calculator project as a **monorepo** or use **path-based routing**
3. Configure it to serve at `/calculator`

## Recommended Approach

**If silicon.net is already a Vercel project:**
- Use Option 1 (integrate into main project)

**If silicon.net is separate or you want to keep projects separate:**
- Use Option 2 (separate project with domain routing)






