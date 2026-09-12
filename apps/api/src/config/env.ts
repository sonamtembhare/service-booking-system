export const APP_URL = process.env.NEXT_PUBLIC_ENV === "production"
    ? "https://your-server-url.vercel.app"
    : "http://localhost:5000"