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
        const validSections = ['what-types-of-spaces', 'how-space-rental-works', 'everything-you-need', 'our-mission', 'pricing', 'about'];
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
          onClick={() => scrollToSection('what-types-of-spaces')}
          className={styles.navLink}
        >
          Spaces
        </button>
        <button
          onClick={() => scrollToSection('everything-you-need')}
          className={styles.navLink}
        >
          Tools & Features
        </button>
        <button
          onClick={() => scrollToSection('our-mission')}
          className={styles.navLink}
        >
          Our Mission
        </button>
        <button
          onClick={() => scrollToSection('pricing')}
          className={styles.navLink}
        >
          Pricing
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className={styles.navLink}
        >
          About
        </button>
      </nav>

      <div className={styles.rightSection}>
        <Link href="/" className={styles.clientLink}>
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
