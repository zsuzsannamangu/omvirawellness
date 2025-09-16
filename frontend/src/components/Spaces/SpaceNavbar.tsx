'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from '@/styles/Spaces/SpaceNavbar.module.scss';

export default function SpaceNavbar() {
  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  };

  // Handle hash navigation on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Remove the # symbol
        // Only scroll if it's a valid section
        const validSections = ['featured-spaces', 'how-it-works', 'benefits', 'pricing'];
        if (validSections.includes(sectionId)) {
          setTimeout(() => {
            scrollToSection(sectionId);
          }, 100);
        }
      }
    }
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/spaces" className={styles.logoLink}>
          Omvira Wellness
        </Link>
      </div>

      <nav className={styles.mainNav}>
        <button
          onClick={() => scrollToSection('featured-spaces')}
          className={styles.navLink}
        >
          Spaces
        </button>
        <button
          onClick={() => scrollToSection('how-it-works')}
          className={styles.navLink}
        >
          How It Works
        </button>
        <button
          onClick={() => scrollToSection('benefits')}
          className={styles.navLink}
        >
          Benefits
        </button>
        <button
          onClick={() => scrollToSection('pricing')}
          className={styles.navLink}
        >
          Pricing
        </button>
      </nav>

      <div className={styles.rightSection}>
        <Link href="/search" className={styles.clientLink}>
          Find a Provider
        </Link>
        <Link href="/providers" className={styles.providerLink}>
          For Providers
        </Link>
        <Link href="/spaces/login" className={styles.loginLink}>
          Log In
        </Link>
        <Link href="/spaces/signup" className={styles.signupButton}>
          List Your Space
        </Link>
      </div>
    </header>
  );
}
