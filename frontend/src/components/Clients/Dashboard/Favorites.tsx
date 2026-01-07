'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaSortAlphaDown, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';
import { getClientFavorites, removeFavorite, getClientId } from '@/services/favorites';
import { SERVICE_CATEGORIES } from '@/config/categories';

interface FavoritesProps {
  activeSubmenu: string;
}

// Format business type string: map category IDs to display names
// Only show categories that are in the unified SERVICE_CATEGORIES list
const formatBusinessType = (businessType: string | null | undefined): string => {
  if (!businessType) return 'Wellness Services';
  
  const validCategories = businessType
    .split(',')
    .map(item => {
      const trimmed = item.trim().toLowerCase();
      // Find category by ID (handle both old format and new format)
      const category = SERVICE_CATEGORIES.find(cat => 
        cat.id === trimmed || 
        cat.id === trimmed.replace(/\s+/g, '-') ||
        cat.name.toLowerCase() === trimmed ||
        cat.displayName.toLowerCase() === trimmed
      );
      
      // Only return display name if category is found in unified list
      return category ? category.displayName : null;
    })
    .filter(Boolean) // Remove null values (categories not in unified list)
    .filter((cat): cat is string => cat !== null); // Type guard
    
  // If no valid categories found, return default
  return validCategories.length > 0 ? validCategories.join(', ') : 'Wellness Services';
};

export default function Favorites({ activeSubmenu }: FavoritesProps) {
  const [favoriteProviders, setFavoriteProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'location'>('name');

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

  // Sort providers based on selected sort option
  const sortedProviders = useMemo(() => {
    const sorted = [...favoriteProviders];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => {
          const nameA = (a.contact_name || a.business_name || '').toLowerCase();
          const nameB = (b.contact_name || b.business_name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
      
      case 'rating':
        sorted.sort((a, b) => {
          const ratingA = parseFloat(a.average_rating || '0');
          const ratingB = parseFloat(b.average_rating || '0');
          // Sort descending (highest rating first)
          return ratingB - ratingA;
        });
        break;
      
      case 'location':
        sorted.sort((a, b) => {
          const locationA = `${a.city || ''}${a.city && a.state ? ', ' : ''}${a.state || ''}`.toLowerCase();
          const locationB = `${b.city || ''}${b.city && b.state ? ', ' : ''}${b.state || ''}`.toLowerCase();
          return locationA.localeCompare(locationB);
        });
        break;
      
      default:
        break;
    }
    
    return sorted;
  }, [favoriteProviders, sortBy]);

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'providers':
        return (
          <div className={styles.favoritesContent}>
            <div className={styles.favoritesHeader}>
              <h2 className={styles.sectionTitle}>Saved Providers</h2>
              {!loading && favoriteProviders.length > 0 && (
                <div className={styles.sortControls}>
                  <label className={styles.sortLabel}>Sort by:</label>
                  <button
                    type="button"
                    className={`${styles.sortButton} ${sortBy === 'name' ? styles.sortButtonActive : ''}`}
                    onClick={() => setSortBy('name')}
                  >
                    <FaSortAlphaDown /> Name
                  </button>
                  <button
                    type="button"
                    className={`${styles.sortButton} ${sortBy === 'rating' ? styles.sortButtonActive : ''}`}
                    onClick={() => setSortBy('rating')}
                  >
                    <FaStar /> Rating
                  </button>
                  <button
                    type="button"
                    className={`${styles.sortButton} ${sortBy === 'location' ? styles.sortButtonActive : ''}`}
                    onClick={() => setSortBy('location')}
                  >
                    <FaMapMarkerAlt /> Location
                  </button>
                </div>
              )}
            </div>
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
                {sortedProviders.map((provider) => {
                  const services = provider.services && Array.isArray(provider.services) && provider.services.length > 0
                    ? provider.services.map((s: any) => s.name || s).join(' • ')
                    : formatBusinessType(provider.business_type || provider.specialties);
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
                        <p className={styles.providerSpecialty}>{services || formatBusinessType(provider.business_type || provider.specialties)}</p>
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
