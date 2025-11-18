/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://muvuyhozuctnbodknzeh.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dnV5aG96dWN0bmJvZGtuemVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODc0ODgsImV4cCI6MjA3ODQ2MzQ4OH0.NKXYmh-Hdkxs0nObfHBhXUA6jX9zFJMcDU7OCJEJWWQ',
  },
}

module.exports = nextConfig
