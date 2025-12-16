# GPU Financing Calculator

A standalone HTML calculator tool for GPU financing calculations.

## Deployment to Vercel

This project is configured for deployment on Vercel.

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Alternative: Deploy via GitHub

1. Push this repository to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Vercel will automatically detect and deploy the static site

## Local Development

To test locally, you can use any static file server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if you have serve installed)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Project Structure

- `index.html` - Main calculator application (standalone HTML file)
- `gpu_financing_calculator_4.html` - Original file (kept for reference)
- `package.json` - Project metadata
- `vercel.json` - Vercel deployment configuration

## Features

- Interactive GPU financing calculator
- Real-time calculations
- Scenario saving and loading
- CSV export functionality
- Responsive design






