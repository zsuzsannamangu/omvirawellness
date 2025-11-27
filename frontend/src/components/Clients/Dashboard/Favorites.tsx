'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';
import { getClientFavorites, removeFavorite, getClientId } from '@/services/favorites';

interface FavoritesProps {
  activeSubmenu: string;
}

// Format business type string: capitalize and add proper spacing
const formatBusinessType = (businessType: string | null | undefined): string => {
  if (!businessType) return 'Wellness Services';
  
  return businessType
    .split(',')
    .map(item => {
      const trimmed = item.trim();
      return trimmed
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    })
    .join(', ');
};

export default function Favorites({ activeSubmenu }: FavoritesProps) {
  const [favoriteProviders, setFavoriteProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from backend
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const clientId = getClientId();
        if (!clientId) {
          setLoading(false);
          return;
        }

        const favorites = await getClientFavorites(clientId);
        setFavoriteProviders(favorites || []);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteProviders([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (providerUserId: string) => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      await removeFavorite(clientId, providerUserId);
      // Remove from local state
      setFavoriteProviders(prev => prev.filter(p => p.user_id !== providerUserId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'providers':
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Saved Providers</h2>
            {loading ? (
              <div className={styles.emptyState}>
                <p>Loading favorites...</p>
              </div>
            ) : favoriteProviders.length === 0 ? (
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
                {favoriteProviders.map((provider) => {
                  const services = provider.services && Array.isArray(provider.services) && provider.services.length > 0
                    ? provider.services.map((s: any) => s.name || s).join(' • ')
                    : formatBusinessType(provider.specialties);
                  const startingPrice = provider.services && Array.isArray(provider.services) && provider.services.length > 0
                    ? provider.services[0].price
                    : null;

                  return (
                    <div key={provider.favorite_id || provider.provider_id} className={styles.providerCard}>
                      <div className={styles.providerImageContainer}>
                        <Image
                          src={provider.profile_photo_url || '/images/screenshots/Jenn.png'}
                          alt={provider.contact_name || provider.business_name || 'Provider'}
                          width={80}
                          height={80}
                          className={styles.providerImage}
                        />
                      </div>
                      <div className={styles.providerInfo}>
                        <h4 className={styles.providerName}>{provider.contact_name || provider.business_name}</h4>
                        <p className={styles.providerSpecialty}>{services || formatBusinessType(provider.specialties)}</p>
                        <div className={styles.providerRating}>
                          <span className={styles.stars}>★★★★★</span>
                          <span className={styles.ratingText}>
                            {provider.average_rating || '4.5'} ({provider.total_reviews || 0} reviews)
                          </span>
                        </div>
                        <p className={styles.providerLocation}>
                          {provider.city || ''}{provider.city && provider.state ? ', ' : ''}{provider.state || ''}
                        </p>
                      </div>
                      <div className={styles.providerActions}>
                        <Link href={`/search/${provider.user_id}`} className={styles.bookBtn}>
                          Book Now
                        </Link>
                        <button 
                          className={styles.removeBtn}
                          onClick={() => handleRemoveFavorite(provider.user_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      
      default:
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Favorites</h2>
            <div className={styles.favoritesOverview}>
              <div className={styles.overviewCard}>
                <h3>Saved Providers</h3>
                <p className={styles.count}>{loading ? '...' : favoriteProviders.length} providers</p>
                <Link href="/search" className={styles.viewBtn}>Explore Providers</Link>
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
