import type { Metadata } from 'next';
import { Forum, Playfair_Display } from 'next/font/google';
import '../styles/tailwind.css';
import '../styles/globals.scss';
import '../styles/accessibility.scss';
import ContactFloatingChip from '@/components/ContactFloatingChip';

// Optimize font loading with Next.js font system for available fonts
const forum = Forum({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-forum',
});

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

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
    <html lang="en" className={`${forum.variable} ${playfair.variable}`}>
      <head>
        {/* Avenir is loaded via globals.scss since it's not available via next/font/google */}
        {/* The preload warning may also be from Next.js route chunk preloading, which is normal */}
      </head>
      <body className="antialiased">
        {children}
        <ContactFloatingChip />
      </body>
    </html>
  );
}
