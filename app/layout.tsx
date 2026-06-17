import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnapClaim — Instant Insurance Claims',
  description:
    'File your insurance claim in seconds. Snap a photo, and we handle the rest.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-animated" aria-hidden="true" />
        <main className="relative min-h-dvh flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
