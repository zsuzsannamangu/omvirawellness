'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaUserFriends, FaHome } from 'react-icons/fa';
import styles from '../styles/Navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

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
      <div className={styles.brandSection}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/Omvira_logo_long.png"
            alt="Omvira Wellness"
            width={300}
            height={75}
            className={styles.logoImage}
            priority
          />
        </Link>
      </div>

      <nav className={styles.mainNav}>
        <button 
          onClick={() => scrollToSection('services')} 
          className={styles.navLink}
        >
          Services
        </button>
        <button 
          onClick={() => scrollToSection('how-it-works')} 
          className={styles.navLink}
        >
          How It Works
        </button>
        <button 
          onClick={() => scrollToSection('faq')} 
          className={styles.navLink}
        >
          FAQ
        </button>
      </nav>

      <div className={styles.rightWrap}>
        <div className={styles.authGroup}>
          <Link href="/login" className={styles.loginLink}>
            Log In
          </Link>
          <Link href="/signup" className={styles.signupButton}>
            Sign Up
          </Link>
        </div>

        <div className={styles.secondaryLinks}>
          <Link href="/providers" className={styles.providerLink}>
            <FaUserFriends className={styles.linkIcon} />
            For Providers
          </Link>
          {pathname?.startsWith('/spaces') ? (
            <Link href="/providers" className={styles.spacesLink}>
              <FaUserFriends className={styles.linkIcon} />
              Find a Provider
            </Link>
          ) : (
            <Link href="/spaces" className={styles.spacesLink}>
              <FaHome className={styles.linkIcon} />
              For Spaces
            </Link>
          )}
        </div>
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
              onClick={() => scrollToSection('services')} 
              className={styles.mobileNavLink}
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className={styles.mobileNavLink}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className={styles.mobileNavLink}
            >
              FAQ
            </button>
            <Link href="/login" className={styles.mobileNavLink}>
              Log In
            </Link>
            <Link href="/signup" className={styles.mobileNavLink}>
              Sign Up
            </Link>
            <Link href="/providers" className={styles.mobileNavLink}>
              <FaUserFriends className={styles.linkIcon} />
              For Providers
            </Link>
            {pathname?.startsWith('/spaces') ? (
              <Link href="/providers" className={styles.mobileNavLink}>
                <FaUserFriends className={styles.linkIcon} />
                Find a Provider
              </Link>
            ) : (
              <Link href="/spaces" className={styles.mobileNavLink}>
                <FaHome className={styles.linkIcon} />
                For Spaces
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
