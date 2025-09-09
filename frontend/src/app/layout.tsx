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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Forum&family=Avenir:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
