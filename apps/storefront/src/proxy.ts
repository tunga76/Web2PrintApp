export { auth as proxy } from '@/auth';

export const config = {
  matcher: ['/account/:path*', '/cart/:path*', '/checkout/:path*', '/admin/:path*', '/production/:path*'],
};
