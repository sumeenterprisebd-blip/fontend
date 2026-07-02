// This file ensures the correct API base URL is used for serverless-safe, deployment-ready API calls.
// Set NEXT_PUBLIC_API_URL in your Vercel/Next.js environment variables to your backend base URL (e.g. https://your-backend.vercel.app/api)
// Set NEXT_PUBLIC_BASE_URL to your frontend base URL (e.g. https://your-frontend.vercel.app)

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
