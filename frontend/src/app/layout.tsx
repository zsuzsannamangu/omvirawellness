import type { Metadata } from 'next';
import '../styles/tailwind.css';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'Omvira Wellness - Wellness, Delivered.',
  description: 'Omvira connects you to trusted, independent providers—massage therapists, yoga teachers, aestheticians, and more—on your terms, in your space.',
  keywords: 'wellness, massage, yoga, aestheticians, booking, providers, health',
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: '/favicon-32.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
