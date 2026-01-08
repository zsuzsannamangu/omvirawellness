'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './client-profile.module.scss';
import { API_URL } from '@/config/api';

interface ClientPublicProfile {
  firstName: string;
  lastName: string;
  pronoun: string | null;
  profilePhotoUrl: string | null;
  zipCode: string | null;
  wellnessGoals: string[];
  preferredServices: string[];
  preferredSessionLength: string | null;
  preferredFrequency: string | null;
  budgetPerSession: string | null;
  locationPreference: string | null;
  timePreference: string | null;
  specialRequirements: string | null;
  travelWillingness: boolean;
  maxTravelDistance: number | null;
  otherGoals: string | null;
  notes: string | null;
}

export default function ClientPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [profile, setProfile] = useState<ClientPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardUrl, setDashboardUrl] = useState<string>('/');

  useEffect(() => {
    // Determine dashboard URL based on logged-in user type
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.user_type === 'provider') {
          setDashboardUrl(`/providers/dashboard/${userData.id}`);
        } else if (userData.user_type === 'client') {
          setDashboardUrl(`/dashboard/${userData.id}`);
        } 
        // SPACES FEATURE - COMMENTED OUT FOR MVP
        // else if (userData.user_type === 'space_owner') {
        //   setDashboardUrl(`/spaces/dashboard/${userData.id}`);
        // }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view this profile');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/clients/${clientId}/public`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load profile' }));
          setError(errorData.error || 'Failed to load profile');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching client profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchProfile();
    }
  }, [clientId]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatBudget = (budget: string | null): string => {
    if (!budget) return '';
    
    // Handle "over-150" or "over-200" to show as "$200+"
    if (budget === 'over-150' || budget === 'over-200') {
      return '$200+';
    }
    
    // If it already starts with $, return as is
    if (budget.startsWith('$')) {
      return budget;
    }
    
    // Format other budget values
    const budgetMap: { [key: string]: string } = {
      'under-50': 'Under $50',
      '50-100': '$50 - $100',
      '100-150': '$100 - $150',
      '150-200': '$150 - $200',
      'flexible': 'Flexible'
    };
    
    return budgetMap[budget] || `$${budget}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to View Profile</h2>
          <p>{error}</p>
          <Link href={dashboardUrl} className={styles.backLink}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Profile Not Found</h2>
          <p>The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={dashboardUrl} className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            {profile.profilePhotoUrl ? (
              <Image
                src={profile.profilePhotoUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={120}
                height={120}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileInitials}>
                {getInitials(profile.firstName, profile.lastName)}
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.clientName}>
              {profile.firstName} {profile.lastName}
              {profile.pronoun && (
                <span className={styles.pronoun}> ({profile.pronoun})</span>
              )}
            </h1>
            {profile.zipCode && (
              <p className={styles.location}>Zip Code: {profile.zipCode}</p>
            )}
          </div>
        </div>

        <div className={styles.profileContent}>
          {/* Preferences Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Preferences</h2>
            
            {profile.preferredServices && profile.preferredServices.length > 0 && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Preferred Services:</span>
                <span className={styles.value}>
                  {profile.preferredServices.join(', ')}
                </span>
              </div>
            )}

            {profile.preferredSessionLength && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Session Length:</span>
                <span className={styles.value}>{profile.preferredSessionLength} minutes</span>
              </div>
            )}

            {profile.preferredFrequency && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Frequency:</span>
                <span className={styles.value}>{profile.preferredFrequency}</span>
              </div>
            )}

            {profile.budgetPerSession && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Budget per Session:</span>
                <span className={styles.value}>{formatBudget(profile.budgetPerSession)}</span>
              </div>
            )}

            {profile.locationPreference && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Location Preference:</span>
                <span className={styles.value}>{profile.locationPreference}</span>
              </div>
            )}

            {profile.timePreference && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Time Preference:</span>
                <span className={styles.value}>{profile.timePreference}</span>
              </div>
            )}

          </div>

          {/* Goals Section */}
          {(profile.wellnessGoals && profile.wellnessGoals.length > 0) || profile.otherGoals ? (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Goals</h2>
              
              {profile.wellnessGoals && profile.wellnessGoals.length > 0 && (
                <div className={styles.goalsSubsection}>
                  <h3 className={styles.subsectionTitle}>Wellness Goals</h3>
                  <div className={styles.preferenceItem}>
                    <span className={styles.value}>
                      {profile.wellnessGoals.join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {profile.otherGoals && (
                <div className={styles.goalsSubsection}>
                  <h3 className={styles.subsectionTitle}>Other Goals</h3>
                  <p className={styles.text}>{profile.otherGoals}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* Special Requirements */}
          {profile.specialRequirements && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Special Requirements</h2>
              <p className={styles.text}>{profile.specialRequirements}</p>
            </div>
          )}

          {/* Travel Preferences */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Travel Preferences</h2>
            <div className={styles.preferenceItem}>
              <span className={styles.label}>Willing to travel to location?</span>
              <span className={styles.value}>{profile.travelWillingness ? 'Yes' : 'No'}</span>
            </div>
            {profile.travelWillingness && profile.maxTravelDistance && (
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Max distance:</span>
                <span className={styles.value}>{profile.maxTravelDistance} miles</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
