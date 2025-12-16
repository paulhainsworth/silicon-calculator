# Setting Up Vercel KV

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Log in to your account

### 2. Navigate to Storage
1. Click on your **silicon-calculator** project
2. Go to the **Storage** tab (in the top navigation)
3. Or go directly to: [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)

### 3. Create a KV Database
1. Click **"Create Database"** or **"Add"**
2. Select **"KV"** (Key-Value store)
3. Choose a name (e.g., `silicon-calculator-kv`)
4. Select a region (choose closest to your users)
5. Click **"Create"**

### 4. Link to Your Project
1. After creating, you'll see the KV database
2. Click **"Connect"** or **"Link Project"**
3. Select your **silicon-calculator** project
4. The environment variables will be automatically added

### 5. Verify Environment Variables
The following environment variables will be automatically added to your project:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

These are automatically available in your serverless functions - no manual configuration needed!

## Pricing
- **Free tier**: 256 MB storage, 30,000 reads/day, 1,000 writes/day
- **Pro tier**: Starts at $0.20/GB storage + usage-based pricing

For URL shortening, the free tier should be more than sufficient.

## Next Steps
After setting up KV, the code will automatically use it. No code changes needed once KV is connected!






