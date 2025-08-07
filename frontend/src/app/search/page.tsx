'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Search.module.scss';

// Sample providers data
const sampleProviders = [
  {
    id: 1,
    name: 'Sarah Chen',
    image: '/images/yoga4.jpg',
    location: 'Los Angeles',
    startingPrice: 85,
    services: ['Private Yoga', 'Yoga Therapy'],
    tags: ['Your Place', 'Pro\'s Studio'],
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    image: '/images/massage2.jpg',
    location: 'Los Angeles',
    startingPrice: 120,
    services: ['Massage', 'Energy Work'],
    tags: ['Your Place', 'Pro\'s Home Studio'],
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'Jennifer Kim',
    image: '/images/facial.jpg',
    location: 'Los Angeles',
    startingPrice: 95,
    services: ['Skincare', 'Facial Treatments'],
    tags: ['Your Place'],
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: 4,
    name: 'Amanda Foster',
    image: '/images/massage3.jpg',
    location: 'Los Angeles',
    startingPrice: 110,
    services: ['Reiki', 'Energy Healing'],
    tags: ['Pro\'s Home Studio', 'Your Place'],
    rating: 4.9,
    reviewCount: 203
  },
  {
    id: 5,
    name: 'Priya Patel',
    image: '/images/ayurveda.jpg',
    location: 'Los Angeles',
    startingPrice: 150,
    services: ['Ayurveda', 'Holistic Healing'],
    tags: ['Your Place', 'Pro\'s Studio'],
    rating: 4.8,
    reviewCount: 94
  },
  {
    id: 6,
    name: 'Dr. Lisa Wang',
    image: '/images/acupuncture2.jpg',
    location: 'Los Angeles',
    startingPrice: 130,
    services: ['Acupuncture', 'Traditional Chinese Medicine'],
    tags: ['Pro\'s Studio'],
    rating: 4.9,
    reviewCount: 178
  },
  {
    id: 7,
    name: 'Tyler Johnson',
    image: '/images/personaltrainer.jpg',
    location: 'Los Angeles',
    startingPrice: 75,
    services: ['Personal Training', 'Fitness Coaching'],
    tags: ['Your Place', 'Pro\'s Studio'],
    rating: 4.6,
    reviewCount: 112
  },
  {
    id: 8,
    name: 'Natalie Goodman',
    image: '/images/hair.jpg',
    location: 'Los Angeles',
    startingPrice: 85,
    services: ['Hair Styling', 'Hair Treatments'],
    tags: ['Your Place', 'Pro\'s Home Studio'],
    rating: 4.7,
    reviewCount: 145
  },
  {
    id: 9,
    name: 'Sophia Martinez',
    image: '/images/nail.jpg',
    location: 'Los Angeles',
    startingPrice: 65,
    services: ['Nail Care', 'Manicures & Pedicures'],
    tags: ['Your Place'],
    rating: 4.5,
    reviewCount: 98
  }
];

const categories = [
  'Private Yoga',
  'Yoga Therapy', 
  'Massage',
  'Skincare',
  'Reiki',
  'Energy Work',
  'Ayurveda',
  'Acupuncture',
  'Personal Training',
  'Doula Care',
  'Hair Styling',
  'Nail Care',
  'Makeup'
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comesToMe, setComesToMe] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle URL parameters on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('q');
      const serviceParam = urlParams.get('service');
      
      if (queryParam) {
        setSearchQuery(queryParam);
      }
      
      if (serviceParam) {
        setSelectedCategories([serviceParam]);
      }
    }
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className={styles.searchPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Omvira Wellness
          </Link>
          
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search for a provider"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button 
            ref={buttonRef}
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Side Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className={styles.sideMenu}>
          <div className={styles.menuContent}>
            <Link href="/login" className={styles.menuItem}>
              Login
            </Link>
            <Link href="/signup" className={styles.menuItem}>
              Sign Up
            </Link>
            <Link href="/providers" className={styles.menuItem}>
              For Providers
            </Link>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <button className={styles.resetButton}>RESET FILTERS</button>
          
          <div className={styles.filterDropdowns}>
            <select className={styles.filterDropdown}>
              <option>Service</option>
              <option>Private Yoga</option>
              <option>Yoga Therapy</option>
              <option>Massage</option>
              <option>Skincare</option>
              <option>Reiki</option>
              <option>Energy Work</option>
              <option>Ayurveda</option>
              <option>Acupuncture</option>
              <option>Personal Training</option>
              <option>Doula Care</option>
              <option>Hair Styling</option>
              <option>Nail Care</option>
              <option>Makeup</option>
            </select>
            
            <select className={styles.filterDropdown}>
              <option>Location</option>
              <option>Comes to Me</option>
              <option>Provider's Studio</option>
              <option>Provider's Home</option>
              <option>Virtual Session</option>
            </select>
            
            <select className={styles.filterDropdown}>
              <option>Price Range</option>
              <option>$0 - $50</option>
              <option>$50 - $100</option>
              <option>$100 - $150</option>
              <option>$150 - $200</option>
              <option>$200+</option>
            </select>
          </div>
        </div>

        {/* Sort Section */}
        <div className={styles.sortSection}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortDropdown}
          >
            <option value="Most Relevant">Popularity</option>
            <option value="Highest Rated">Highest Rated</option>
            <option value="Lowest Price">Lowest Price</option>
            <option value="Highest Price">Highest Price</option>
            <option value="Most Reviews">Most Experienced</option>
          </select>
        </div>

        {/* Provider Grid */}
        <div className={styles.providersGrid}>
          {sampleProviders.map((provider) => (
            <div key={provider.id} className={styles.providerCard}>
              <div className={styles.providerImage}>
                <Image
                  src={provider.image}
                  alt={provider.name}
                  width={300}
                  height={200}
                  className={styles.image}
                />
                <div className={styles.duration}>60 Min</div>
              </div>
              
              <div className={styles.providerInfo}>
                <h3 className={styles.providerName}>{provider.name}</h3>
                <p className={styles.providerServices}>{provider.services.join(' • ')}</p>
                <p className={styles.providerLocation}>{provider.location}</p>
                <div className={styles.providerRating}>
                  <span className={styles.stars}>★★★★★</span>
                  <span className={styles.ratingText}>{provider.rating} ({provider.reviewCount})</span>
                </div>
                <p className={styles.startingPrice}>From ${provider.startingPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 