import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rollin Community - Event Registration',
  description: 'Private community experience registration page',
  icons: {
    icon: '/favicon.ico', // or /logo.png if we prefer
    shortcut: '/favicon.ico',
    apple: '/logo.png', // Apple touch icon usually best as png
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
