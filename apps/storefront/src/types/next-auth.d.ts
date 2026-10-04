import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: 'CUSTOMER' | 'ADMIN' | 'PRODUCTION';
    };
  }

  interface User {
    role: 'CUSTOMER' | 'ADMIN' | 'PRODUCTION';
    sessionVersion: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: 'CUSTOMER' | 'ADMIN' | 'PRODUCTION';
    sessionVersion?: number;
    invalidated?: boolean;
  }
}
