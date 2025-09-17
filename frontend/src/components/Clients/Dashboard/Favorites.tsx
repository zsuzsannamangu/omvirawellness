'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface FavoritesProps {
  activeSubmenu: string;
}

// Sample providers data (should match the data from search page)
const sampleProviders = [
  {
    id: 1,
    name: 'Sarah Chen',
    image: '/images/yoga4.jpg',
    location: 'Los Angeles',
    startingPrice: 85,
    services: ['Private Yoga', 'Yoga Therapy'],
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
    rating: 4.5,
    reviewCount: 98
  }
];

export default function Favorites({ activeSubmenu }: FavoritesProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favoriteProviders');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  const removeFavorite = (providerId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== providerId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteProviders', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  };

  const getFavoriteProviders = () => {
    return sampleProviders.filter(provider => favorites.includes(provider.id));
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'providers':
        const favoriteProviders = getFavoriteProviders();
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Saved Providers</h2>
            {favoriteProviders.length === 0 ? (
              <div className={styles.emptyState}>
                <FaHeart className={styles.emptyIcon} />
                <h3>No saved providers yet</h3>
                <p>Start exploring providers and add them to your favorites!</p>
                <Link href="/search" className={styles.exploreBtn}>
                  Explore Providers
                </Link>
              </div>
            ) : (
              <div className={styles.providersGrid}>
                {favoriteProviders.map((provider) => (
                  <div key={provider.id} className={styles.providerCard}>
                    <div className={styles.providerImageContainer}>
                      <Image
                        src={provider.image}
                        alt={provider.name}
                        width={80}
                        height={80}
                        className={styles.providerImage}
                      />
                    </div>
                    <div className={styles.providerInfo}>
                      <h4 className={styles.providerName}>{provider.name}</h4>
                      <p className={styles.providerSpecialty}>{provider.services.join(' • ')}</p>
                      <div className={styles.providerRating}>
                        <span className={styles.stars}>★★★★★</span>
                        <span className={styles.ratingText}>{provider.rating} ({provider.reviewCount} reviews)</span>
                      </div>
                      <p className={styles.providerLocation}>{provider.location}</p>
                    </div>
                    <div className={styles.providerActions}>
                      <Link href={`/search/${provider.id}`} className={styles.bookBtn}>
                        Book Now
                      </Link>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeFavorite(provider.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      
      default:
        const favoriteProvidersCount = getFavoriteProviders().length;
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Favorites</h2>
            <div className={styles.favoritesOverview}>
              <div className={styles.overviewCard}>
                <h3>Saved Providers</h3>
                <p className={styles.count}>{favoriteProvidersCount} providers</p>
                <button className={styles.viewBtn}>View All</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
