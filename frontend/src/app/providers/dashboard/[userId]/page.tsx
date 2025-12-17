'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FaStar, FaReply, FaLink } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Providers/Dashboard/Bookings';
import Spaces from '@/components/Providers/Dashboard/Spaces';
import Calendar from '@/components/Providers/Dashboard/Calendar';
import Clients from '@/components/Providers/Dashboard/Clients';
import Payments from '@/components/Providers/Dashboard/Payments';
import Stats from '@/components/Providers/Dashboard/Stats';
import Messages from '@/components/Providers/Dashboard/Messages';
import Profile from '@/components/Providers/Dashboard/Profile';

export default function ProvidersDashboard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.userId as string;
  
  // Check URL parameters for section
  const initialSection = searchParams.get('section') || 'bookings';
  const [activeSection, setActiveSection] = useState(initialSection);
  const [activeSubmenu, setActiveSubmenu] = useState(
    initialSection === 'profile' ? 'basic' : 
    initialSection === 'stats' ? 'traffic' :
    initialSection === 'messages' ? 'notifications' :
    'requests'
  );
  const [activeCommunicationSubmenu, setActiveCommunicationSubmenu] = useState('inbox');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('Loading...');
  const [providerRating, setProviderRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      // Clear any remaining state and redirect
      setLoading(false);
      router.replace('/providers/login');
      return;
    }
    
    let handleProfileUpdate: (() => void) | null = null;
    
    try {
      const userData = JSON.parse(user);
      // Verify the userId matches the logged-in user
      if (userData.id !== userId) {
        console.error('User ID mismatch');
        router.push('/providers/login');
        return;
      }
      
      // Verify user is a provider
      if (userData.user_type !== 'provider') {
        router.push('/providers/login');
        return;
      }

      // Set provider name from profile
      const updateProviderName = () => {
        if (userData.profile?.contact_name) {
          setProviderName(userData.profile.contact_name);
        } else if (userData.profile?.business_name) {
          setProviderName(userData.profile.business_name);
        } else if (userData.email) {
          setProviderName(userData.email.split('@')[0]);
        }
      };
      
      updateProviderName();
      
      // Load profile image if available
      if (userData.profile?.profile_photo_url) {
        setProfileImage(userData.profile.profile_photo_url);
      }

      // Listen for profile updates
      handleProfileUpdate = () => {
        const updatedUser = localStorage.getItem('user');
        if (updatedUser) {
          try {
            const updatedUserData = JSON.parse(updatedUser);
            if (updatedUserData.profile?.contact_name) {
              setProviderName(updatedUserData.profile.contact_name);
            } else if (updatedUserData.profile?.business_name) {
              setProviderName(updatedUserData.profile.business_name);
            }
            if (updatedUserData.profile?.profile_photo_url) {
              setProfileImage(updatedUserData.profile.profile_photo_url);
            }
          } catch (error) {
            console.error('Error updating provider name:', error);
          }
        }
      };

      window.addEventListener('profileUpdated', handleProfileUpdate);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/providers/login');
      return;
    }
    
    setLoading(false);

    // Cleanup listener on unmount
    return () => {
      if (handleProfileUpdate) {
        window.removeEventListener('profileUpdated', handleProfileUpdate);
      }
    };
  }, [userId, router]);

  // Load pending requests count
  useEffect(() => {
    let isMounted = true;
    
    const loadPending = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch(`http://localhost:4000/api/bookings/provider/${userId}/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok && isMounted) {
          const data = await resp.json();
          setPendingRequests(Array.isArray(data) ? data.length : 0);
        }
      } catch (e) {
        if (isMounted) {
          setPendingRequests(0);
        }
      }
    };

    loadPending();

    const refresh = () => {
      if (isMounted) {
        loadPending();
      }
    };
    window.addEventListener('refreshBookings', refresh);
    return () => {
      isMounted = false;
      window.removeEventListener('refreshBookings', refresh);
    };
  }, [userId]);

  // Load unread notifications count
  useEffect(() => {
    let isMounted = true;
    
    const loadUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch('http://localhost:4000/api/notifications/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok && isMounted) {
          const data = await resp.json();
          setUnreadNotifications(data.count || 0);
        }
      } catch (e) {
        if (isMounted) {
          setUnreadNotifications(0);
        }
      }
    };

    loadUnreadNotifications();

    // Refresh notifications when bookings are updated (might include notification triggers)
    const refresh = () => {
      if (isMounted) {
        loadUnreadNotifications();
      }
    };
    window.addEventListener('refreshBookings', refresh);
    
    // Also listen for notification updates
    const refreshNotifications = () => {
      if (isMounted) {
        loadUnreadNotifications();
      }
    };
    window.addEventListener('refreshNotifications', refreshNotifications);
    
    return () => {
      isMounted = false;
      window.removeEventListener('refreshBookings', refresh);
      window.removeEventListener('refreshNotifications', refreshNotifications);
    };
  }, [userId]);

  // Load provider stats (reviews, services, bookings)
  useEffect(() => {
    const loadProviderStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;
        
        // Load reviews for rating
        const reviewsResponse = await fetch(`http://localhost:4000/api/reviews/provider/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          if (Array.isArray(reviews) && reviews.length > 0) {
            const avg = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
            setProviderRating(avg);
            setTotalReviews(reviews.length);
          } else {
            setProviderRating(null);
            setTotalReviews(0);
          }
        }
        
        // Load provider profile to get services count
        const providerResponse = await fetch(`http://localhost:4000/api/providers/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (providerResponse.ok) {
          const providerData = await providerResponse.json();
          if (providerData.services && Array.isArray(providerData.services)) {
            // Filter out empty services
            const validServices = providerData.services.filter((s: any) => 
              s && s.name && s.name.trim() !== ''
            );
            setServicesCount(validServices.length);
          } else {
            setServicesCount(0);
          }
        }
        
        // Load bookings to get total count
        const bookingsResponse = await fetch(`http://localhost:4000/api/bookings/provider/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json();
          if (Array.isArray(bookings)) {
            setTotalBookings(bookings.length);
          } else {
            setTotalBookings(0);
          }
        }
        
        // Set profile URL
        if (typeof window !== 'undefined') {
          const baseUrl = window.location.origin;
          setProfileUrl(`${baseUrl}/search/${userId}`);
        }
      } catch (error) {
        console.error('Error loading provider stats:', error);
      }
    };
    
    loadProviderStats();
  }, [userId]);

  // Load unread messages count
  useEffect(() => {
    let isMounted = true;
    
    const loadUnreadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch('http://localhost:4000/api/messages/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok && isMounted) {
          const data = await resp.json();
          setUnreadMessages(data.count || 0);
        }
      } catch (e) {
        if (isMounted) {
          setUnreadMessages(0);
        }
      }
    };

    loadUnreadMessages();

    // Poll for unread messages every 10 seconds
    const pollInterval = setInterval(() => {
      if (isMounted) {
        loadUnreadMessages();
      }
    }, 10000); // Check every 10 seconds

    // Refresh messages when bookings are updated
    const refresh = () => {
      if (isMounted) {
        loadUnreadMessages();
      }
    };
    window.addEventListener('refreshBookings', refresh);

    // Also listen for message updates
    const refreshMessages = () => {
      if (isMounted) {
        loadUnreadMessages();
      }
    };
    window.addEventListener('refreshMessages', refreshMessages);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('refreshBookings', refresh);
      window.removeEventListener('refreshMessages', refreshMessages);
    };
  }, [userId]);

  // Allow children to request submenu switch (e.g., after accepting a booking)
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.submenu) setActiveSubmenu(e.detail.submenu);
    };
    window.addEventListener('switchSubmenu', handler);
    return () => window.removeEventListener('switchSubmenu', handler);
  }, []);

  // Handle section switching (e.g., from bookings to messages)
  useEffect(() => {
    const sectionHandler = (e: any) => {
      if (e?.detail?.section) {
        setActiveSection(e.detail.section);
        if (e?.detail?.submenu) {
          setActiveSubmenu(e.detail.submenu);
        } else {
          // Get submenu items dynamically
          const submenuItems = {
            bookings: [{ id: 'requests' }],
            spaces: [{ id: 'upcoming' }],
            calendar: [{ id: 'overview' }],
            clients: [{ id: 'directory' }],
            payments: [{ id: 'balance' }],
            stats: [{ id: 'traffic' }],
            messages: [{ id: 'notifications' }, { id: 'inbox' }, { id: 'starred' }, { id: 'sent' }, { id: 'trash' }],
            profile: [{ id: 'basic' }],
            settings: [{ id: 'account' }],
          };
          const firstSubmenu = submenuItems[e.detail.section as keyof typeof submenuItems]?.[0];
          setActiveSubmenu(firstSubmenu?.id || e.detail.section);
        }
      }
    };
    window.addEventListener('switchSection', sectionHandler);
    return () => window.removeEventListener('switchSection', sectionHandler);
  }, []);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        setProfileImage(imageDataUrl);
        
        // Save to localStorage
        try {
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            if (userData.profile) {
              userData.profile.profile_photo_url = imageDataUrl;
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        } catch (error) {
          console.error('Error saving profile image to localStorage:', error);
        }
        
        // Save to database
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                profile_photo_url: imageDataUrl
              })
            });
            
            if (!response.ok) {
              console.error('Failed to save profile image to database');
            } else {
              console.log('Profile image saved successfully to database');
            }
          }
        } catch (error) {
          console.error('Error saving profile image to database:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarItems = [
    { id: 'bookings', label: 'Bookings' },
    { id: 'spaces', label: 'Space Rentals' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'clients', label: 'Clients' },
    { id: 'payments', label: 'Payments & Earnings' },
    { id: 'stats', label: 'Stats' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile & Services' },
    { id: 'settings', label: 'Account Settings' },
    { id: 'signout', label: 'Sign Out' },
  ];

  const submenuItems = {
    bookings: [
      { id: 'requests', label: 'Requests' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'past', label: 'Past' },
      { id: 'canceled', label: 'Canceled' },
    ],
    spaces: [
      { id: 'upcoming', label: 'Upcoming Bookings' },
      { id: 'favorites', label: 'Saved Spaces' },
      { id: 'past', label: 'Past Bookings' },
      { id: 'request', label: 'Request a Space' },
      { id: 'find', label: 'Find a Space' },
    ],
    calendar: [
      { id: 'overview', label: 'Calendar Overview' },
      { id: 'sync', label: 'Sync with Google/Apple Calendar' },
    ],
    clients: [
      { id: 'directory', label: 'Client Directory' },
      { id: 'notes', label: 'Notes & Preferences' },
    ],
    payments: [
      { id: 'balance', label: 'Balance Overview' },
      { id: 'payouts', label: 'Payouts' },
      { id: 'reports', label: 'Reports' },
      { id: 'statements', label: 'Monthly Statements' },
    ],
    stats: [
      { id: 'traffic', label: 'Traffic' },
      { id: 'bookings', label: 'Bookings' },
      { id: 'revenue', label: 'Revenue' },
      { id: 'reviews', label: 'Reviews' },
    ],
    messages: [
      { id: 'notifications', label: 'Notifications' },
      { id: 'communication', label: 'Client Communication' },
      { id: 'reminders', label: 'Reminders' },
    ],
    profile: [
      { id: 'basic', label: 'Basic Information' },
      { id: 'preferences', label: 'Preferences' },
      { id: 'services', label: 'Services' },
      { id: 'availability', label: 'Availability' },
      { id: 'certifications', label: 'Certifications' },
    ],
    settings: [
      { id: 'account', label: 'Account Information' },
      { id: 'subscription', label: 'Subscription' },
      { id: 'billing', label: 'Billing' },
    ],
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <Bookings activeSubmenu={activeSubmenu} />;
      case 'spaces':
        return <Spaces activeSubmenu={activeSubmenu} />;
      case 'calendar':
        return <Calendar activeSubmenu={activeSubmenu} />;
      case 'clients':
        return <Clients activeSubmenu={activeSubmenu} />;
      case 'payments':
        return <Payments activeSubmenu={activeSubmenu} />;
      case 'stats':
        return <Stats activeSubmenu={activeSubmenu} />;
      case 'messages':
        return <Messages activeSubmenu={activeSubmenu === 'communication' ? activeCommunicationSubmenu : activeSubmenu} userId={userId} />;
      case 'profile':
        return <Profile activeSubmenu={activeSubmenu} />;
      case 'settings':
        const user = localStorage.getItem('user');
        const userData = user ? JSON.parse(user) : null;
        const profile = userData?.profile || {};
        const email = userData?.email || '';
        
        // Render different settings submenus
        switch (activeSubmenu) {
          case 'account':
            return (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Account Information</h2>
                
                <div className={styles.settingsForm}>
                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <input type="email" className={`${styles.formInput} ${styles.accountInfoInput}`} defaultValue={email} disabled />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Password</label>
                      <div className={`${styles.formRowFlex} ${styles.accountInfoRow}`}>
                        <input 
                          type="password" 
                          className={`${styles.formInput} ${styles.formInputFlex} ${styles.formInputDisabled} ${styles.accountInfoInput}`}
                          defaultValue="••••••••" 
                          disabled 
                        />
                        <button className={styles.secondaryBtn}>Change Password</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
            
          case 'subscription':
            return (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Subscription</h2>
                
                <div className={styles.subscriptionContainer}>
                  {/* Current Plan Card */}
                  <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardHeader}>
                      <div className={styles.subscriptionCardTitle}>
                        <h3>Current Plan</h3>
                        <span className={styles.activeBadge}>Active</span>
                      </div>
                    </div>
                    <div className={styles.subscriptionCardBody}>
                      <div className={styles.planDetails}>
                        <div className={styles.planNameLarge}>Professional Plan</div>
                        <div className={styles.planPriceLarge}>$59<span className={styles.planPeriod}>/month</span></div>
                      </div>
                      <div className={styles.planFeatures}>
                        <div className={styles.planFeature}>
                          <span className={styles.featureCheck}>✓</span>
                          <span>Unlimited bookings</span>
                        </div>
                        <div className={styles.planFeature}>
                          <span className={styles.featureCheck}>✓</span>
                          <span>Advanced analytics</span>
                        </div>
                        <div className={styles.planFeature}>
                          <span className={styles.featureCheck}>✓</span>
                          <span>Priority support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Payment Card */}
                  <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardHeader}>
                      <h3>Next Payment</h3>
                    </div>
                    <div className={styles.subscriptionCardBody}>
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentDateLarge}>January 15, 2025</div>
                        <div className={styles.paymentAmountLarge}>$59.00</div>
                      </div>
                      <p className={styles.paymentDescription}>Your subscription will automatically renew on this date</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.subscriptionActions}>
                    <button className={styles.changePlanBtn}>
                      Change Plan
                    </button>
                    <button className={styles.cancelSubscriptionBtn}>
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            );
            
          case 'billing':
            return (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Billing</h2>
                
                <div className={styles.settingsForm}>
                  <div className={styles.formSection}>
                    <h3 className={styles.subsectionTitle}>Payment Method</h3>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Card Number</label>
                      <input type="text" className={`${styles.formInput} ${styles.cardNumberInput}`} placeholder="**** **** **** 1234" disabled />
                    </div>

                    <div className={`${styles.formRow} ${styles.cardDetailsRow}`}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Expiry Date</label>
                        <input type="text" className={`${styles.formInput} ${styles.expiryInput}`} placeholder="MM/YY" />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>CVV</label>
                        <input type="text" className={`${styles.formInput} ${styles.cvvInput}`} placeholder="***" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h3 className={styles.subsectionTitle}>Billing History</h3>
                    <div className={styles.billingHistory}>
                      <p>No billing history available</p>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button className={styles.saveBtn}>Update Payment Method</button>
                  </div>
                </div>
              </div>
            );
            
          default:
            return (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Account Settings</h2>
                <div className={styles.placeholderText}>
                  <p>Select a settings option from the submenu above.</p>
                </div>
              </div>
            );
        }
      default:
        return <Bookings activeSubmenu={activeSubmenu} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.centeredContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Provider Dashboard</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => {
                if (item.id === 'signout') {
                  // Clear authentication
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  // Stop loading state and redirect immediately
                  setLoading(false);
                  router.replace('/providers/login');
                } else {
                  setActiveSection(item.id);
                  const firstSubmenu = submenuItems[item.id as keyof typeof submenuItems]?.[0];
                  setActiveSubmenu(firstSubmenu?.id || item.id);
                }
              }}
            >
              <span className={styles.sidebarLabel}>{item.label}</span>
              {item.id === 'messages' && (unreadNotifications + unreadMessages) > 0 && (
                <span className={styles.badge}>{unreadNotifications + unreadMessages}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Top Navigation */}
        <div className={styles.topNav}>
          <div className={styles.greetingSection}>
            <div className={styles.profileImageContainer} onClick={handleImageClick}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Provider Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileInitials}>
                  {getInitials(providerName)}
                </div>
              )}
            </div>
            <div className={styles.greetingInfo}>
              <h1 className={styles.greeting}>
                Hi there, {providerName}
                {providerRating !== null && totalReviews > 0 && (
                  <span className={styles.headerRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className={(i + 1) <= Math.round(providerRating) ? styles.headerStarFilled : styles.headerStarEmpty} />
                    ))}
                    <strong>{providerRating.toFixed(1)}</strong>
                    <span className={styles.headerReviewCount}>({totalReviews})</span>
                  </span>
                )}
              </h1>
              <div className={styles.userStats}>
                {servicesCount > 0 && (
                  <>
                    <span className={styles.statItem}>{servicesCount} {servicesCount === 1 ? 'service' : 'services'}</span>
                    <span className={styles.statSeparator}>|</span>
                  </>
                )}
                {totalBookings > 0 && (
                  <>
                    <span className={styles.statItem}>{totalBookings} {totalBookings === 1 ? 'booking' : 'bookings'}</span>
                    <span className={styles.statSeparator}>|</span>
                  </>
                )}
                {profileUrl && (
                  <a href={profileUrl} className={styles.profileLink} target="_blank" rel="noopener noreferrer">
                    {profileUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                    <FaLink className={styles.linkIcon} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.topNavRight}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className={styles.hidden}
            />
          </div>
        </div>

        {/* Submenu Navigation */}
        <div className={styles.submenu}>
          {submenuItems[activeSection as keyof typeof submenuItems]?.map((item) => (
            <button
              key={item.id}
              className={`${styles.submenuItem} ${activeSubmenu === item.id ? styles.active : ''}`}
              onClick={() => {
                setActiveSubmenu(item.id);
                // If clicking on communication, set default submenu to inbox
                if (item.id === 'communication') {
                  setActiveCommunicationSubmenu('inbox');
                }
              }}
            >
              {item.label}
              {activeSection === 'bookings' && item.id === 'requests' && pendingRequests > 0 && (
                <span className={styles.badge}>{pendingRequests}</span>
              )}
              {activeSection === 'messages' && item.id === 'notifications' && unreadNotifications > 0 && (
                <span className={styles.badge}>{unreadNotifications}</span>
              )}
              {activeSection === 'messages' && item.id === 'communication' && unreadMessages > 0 && (
                <span className={styles.badge}>{unreadMessages}</span>
              )}
            </button>
          ))}
          {/* Nested submenu for Client Communication - appears below all main menu items */}
          {activeSection === 'messages' && activeSubmenu === 'communication' && (
            <div className={styles.nestedSubmenu}>
              {[
                { id: 'inbox', label: 'Inbox' },
                { id: 'starred', label: 'Starred' },
                { id: 'sent', label: 'Sent' },
                { id: 'trash', label: 'Trash' },
              ].map((nestedItem) => (
                <button
                  key={nestedItem.id}
                  className={`${styles.nestedSubmenuItem} ${activeCommunicationSubmenu === nestedItem.id ? styles.active : ''}`}
                  onClick={() => setActiveCommunicationSubmenu(nestedItem.id)}
                >
                  {nestedItem.label}
                  {nestedItem.id === 'inbox' && unreadMessages > 0 && (
                    <span className={styles.badge}>{unreadMessages}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

