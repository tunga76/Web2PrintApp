import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Web2Print | Custom printing made simple',
    template: '%s | Web2Print',
  },
  description:
    'Order custom business cards, flyers, brochures and more. Configure your print and get a clear price before checkout.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
