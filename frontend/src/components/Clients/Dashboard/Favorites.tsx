'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaChevronDown } from 'react-icons/fa';
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
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'location' | 'price'>('name');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    if (sortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  // Sort providers based on selected sort option
  const sortedProviders = useMemo(() => {
    const providers = [...favoriteProviders];
    
    switch (sortBy) {
      case 'name':
        return providers.sort((a, b) => {
          const nameA = (a.contact_name || a.business_name || '').toLowerCase();
          const nameB = (b.contact_name || b.business_name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      
      case 'rating':
        return providers.sort((a, b) => {
          const ratingA = parseFloat(a.average_rating) || 0;
          const ratingB = parseFloat(b.average_rating) || 0;
          return ratingB - ratingA; // Highest first
        });
      
      case 'location':
        return providers.sort((a, b) => {
          const locationA = `${a.city || ''} ${a.state || ''}`.trim().toLowerCase();
          const locationB = `${b.city || ''} ${b.state || ''}`.trim().toLowerCase();
          return locationA.localeCompare(locationB);
        });
      
      case 'price':
        return providers.sort((a, b) => {
          const priceA = a.services && Array.isArray(a.services) && a.services.length > 0
            ? parseFloat(a.services[0].price) || 999999
            : 999999;
          const priceB = b.services && Array.isArray(b.services) && b.services.length > 0
            ? parseFloat(b.services[0].price) || 999999
            : 999999;
          return priceA - priceB; // Lowest first
        });
      
      default:
        return providers;
    }
  }, [favoriteProviders, sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name': return 'Name (A-Z)';
      case 'rating': return 'Rating (Highest)';
      case 'location': return 'Location';
      case 'price': return 'Price (Lowest)';
      default: return 'Sort by...';
    }
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'providers':
        return (
          <div className={styles.favoritesContent}>
            <div className={styles.favoritesHeader}>
              <h2 className={styles.sectionTitle}>Saved Providers</h2>
              {!loading && favoriteProviders.length > 0 && (
                <div className={styles.sortContainer} ref={dropdownRef}>
                  <button
                    className={styles.sortButton}
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  >
                    <span>{getSortLabel()}</span>
                    <FaChevronDown className={`${styles.sortChevron} ${sortDropdownOpen ? styles.sortChevronOpen : ''}`} />
                  </button>
                  {sortDropdownOpen && (
                    <div className={styles.sortDropdown}>
                      <button
                        className={`${styles.sortOption} ${sortBy === 'name' ? styles.sortOptionActive : ''}`}
                        onClick={() => {
                          setSortBy('name');
                          setSortDropdownOpen(false);
                        }}
                      >
                        Name (A-Z)
                      </button>
                      <button
                        className={`${styles.sortOption} ${sortBy === 'rating' ? styles.sortOptionActive : ''}`}
                        onClick={() => {
                          setSortBy('rating');
                          setSortDropdownOpen(false);
                        }}
                      >
                        Rating (Highest)
                      </button>
                      <button
                        className={`${styles.sortOption} ${sortBy === 'location' ? styles.sortOptionActive : ''}`}
                        onClick={() => {
                          setSortBy('location');
                          setSortDropdownOpen(false);
                        }}
                      >
                        Location
                      </button>
                      <button
                        className={`${styles.sortOption} ${sortBy === 'price' ? styles.sortOptionActive : ''}`}
                        onClick={() => {
                          setSortBy('price');
                          setSortDropdownOpen(false);
                        }}
                      >
                        Price (Lowest)
                      </button>
                    </div>
                  )}
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
