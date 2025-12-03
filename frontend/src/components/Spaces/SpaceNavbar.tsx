'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/Spaces/SpaceNavbar.module.scss';

export default function SpaceNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
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

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/spaces" className={styles.logoLink}>
          <Image
            src="/Omvira_logo_white.png"
            alt="Omvira Wellness"
            width={300}
            height={75}
            className={styles.spaceLogoImage}
            priority
          />
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

      <button 
        ref={buttonRef}
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          {isMenuOpen ? (
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          ) : (
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <div ref={menuRef} className={styles.mobileMenu}>
          <button 
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <div className={styles.mobileMenuContent}>
            <button 
              onClick={() => scrollToSection('featured-spaces')} 
              className={styles.mobileNavLink}
            >
              Spaces
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className={styles.mobileNavLink}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('benefits')} 
              className={styles.mobileNavLink}
            >
              Benefits
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className={styles.mobileNavLink}
            >
              Pricing
            </button>
            <Link href="/search" className={styles.mobileNavLink}>
              Find a Provider
            </Link>
            <Link href="/providers" className={styles.mobileNavLink}>
              For Providers
            </Link>
            <Link href="/spaces/login" className={styles.mobileNavLink}>
              Log In
            </Link>
            <Link href="/spaces/signup" className={styles.mobileNavLink}>
              List Your Space
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
