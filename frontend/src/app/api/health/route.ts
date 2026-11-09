import { NextResponse } from 'next/server';

// Liveness probe for Coolify's container health check. Deliberately dependency
// free: it answers only "is this Next server process serving requests?", so a
// slow or unreachable backend never marks the web container unhealthy.
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: process.env.NEXT_PUBLIC_APP_NAME ?? 'ambrosia-web',
    timestamp: new Date().toISOString(),
  });
}
