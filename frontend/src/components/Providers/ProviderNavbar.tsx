'use client';

import Link from 'next/link';
import styles from '@/styles/Providers/ProviderNavbar.module.scss';

export default function ProviderNavbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Book a Provider</Link>
      </div>
      <nav className={styles.navLinks}>
        <Link href="#benefits" className={styles.link}>
          Benefits
        </Link>
        <Link href="#features" className={styles.link}>
          Features
        </Link>
        <Link href="#testimonials" className={styles.link}>
          Testimonials
        </Link>
        <Link href="/pre-sale" className={styles.ctaLink}>
          Join Waitlist
        </Link>
      </nav>
    </header>
  );
}
