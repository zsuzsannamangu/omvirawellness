'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaCalendarAlt, FaCalendar, FaHeart, FaDollarSign, 
  FaEnvelope, FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Clients/Dashboard/Bookings';
import Favorites from '@/components/Clients/Dashboard/Favorites';
import Payments from '@/components/Clients/Dashboard/Payments';
import Calendar from '@/components/Clients/Dashboard/Calendar';
import Messages from '@/components/Clients/Dashboard/Messages';
import Profile from '@/components/Clients/Dashboard/Profile';
import ChangePasswordModal from '@/components/Clients/Dashboard/ChangePasswordModal';
import UpdateEmailModal from '@/components/Clients/Dashboard/UpdateEmailModal';
import { API_URL } from '@/config/api';

function ClientDashboardContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.userId as string;
  
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('upcoming');
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

  // Handle OAuth token from URL hash or query params (Google sign-in)
  useEffect(() => {
    // Check hash fragment first (new method to avoid HTTP 431)
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const hashData = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
        if (hashData.token) {
          localStorage.setItem('token', hashData.token);
          if (hashData.user) {
            localStorage.setItem('user', JSON.stringify(hashData.user));
          }
          // If profile needs completion, set URL params
          if (hashData.complete_profile) {
            const section = hashData.section || 'profile';
            router.replace(`/dashboard/${userId}?complete_profile=true&section=${section}`);
            setActiveSection('profile');
          } else {
            // Remove hash from URL
            router.replace(`/dashboard/${userId}`);
          }
          return;
        }
      } catch (error) {
        console.error('Error parsing hash data:', error);
      }
    }
    
    // Fallback to query params (old method)
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    const completeProfile = searchParams.get('complete_profile');
    if (token) {
      localStorage.setItem('token', decodeURIComponent(token));
      if (userData) {
        localStorage.setItem('user', decodeURIComponent(userData));
      }
      // If profile needs completion, keep the section parameter
      if (completeProfile === 'true') {
        const section = searchParams.get('section') || 'profile';
        setNeedsProfileCompletion(true);
        router.replace(`/dashboard/${userId}?complete_profile=true&section=${section}`);
        setActiveSection('profile');
      } else {
        // Remove token from URL
        router.replace(`/dashboard/${userId}`);
      }
    }
  }, [searchParams, userId, router]);
  
  // Set default submenu when switching sections
  useEffect(() => {
    if (activeSection === 'messages' && (activeSubmenu === 'upcoming' || activeSubmenu === 'confirmations' || activeSubmenu === 'direct')) {
      setActiveSubmenu('inbox');
    }
    if (activeSection === 'payments' && activeSubmenu === 'methods') {
      setActiveSubmenu('receipts');
    }
  }, [activeSection, activeSubmenu]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('User'); // Will be loaded from user data
  const [totalBookings, setTotalBookings] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserData = async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        router.push('/login');
        return;
      }
      
      // Validate token with backend
      try {
        const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!verifyResponse.ok) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
      } catch (verifyError) {
        // Network error or token validation failed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      try {
        const userData = JSON.parse(user);
        // Verify the userId matches the logged-in user
        if (userData.id !== userId) {
          console.error('User ID mismatch');
          router.push('/login');
          return;
        }
        
        // Load user profile data
        if (userData.profile?.first_name && userData.profile?.last_name) {
          setUserName(`${userData.profile.first_name} ${userData.profile.last_name}`);
        } else if (userData.email) {
          // Extract first part of email as fallback name
          setUserName(userData.email.split('@')[0]);
        }
        
        // Set user email
        if (userData.email) {
          setUserEmail(userData.email);
        }
        
        // Load booking stats
        try {
          const statsResponse = await fetch(`${API_URL}/bookings/client/${userId}/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setTotalBookings(statsData.totalBookings || 0);
          }
        } catch (statsError) {
          console.error('Error loading booking stats:', statsError);
          // Don't fail the whole page load if stats fail
        }
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
        return;
      }
      
      setLoading(false);
    };

    loadUserData();

    // Listen for profile update events to refresh name and email
    const handleProfileUpdate = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.profile?.first_name && userData.profile?.last_name) {
            setUserName(`${userData.profile.first_name} ${userData.profile.last_name}`);
          }
          if (userData.email) {
            setUserEmail(userData.email);
          }
        } catch (error) {
          console.error('Error parsing user data on profile update:', error);
        }
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [userId, router]);

  // Load unread messages count
  useEffect(() => {
    let isMounted = true;
    
    const loadUnreadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch(`${API_URL}/messages/unread-count`, {
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

  // Listen for change password and update email events from Profile component
  useEffect(() => {
    const handleOpenChangePassword = () => {
      setShowChangePasswordModal(true);
    };

    const handleOpenUpdateEmail = () => {
      setShowUpdateEmailModal(true);
    };

    window.addEventListener('openChangePassword', handleOpenChangePassword);
    window.addEventListener('openUpdateEmail', handleOpenUpdateEmail);
    return () => {
      window.removeEventListener('openChangePassword', handleOpenChangePassword);
      window.removeEventListener('openUpdateEmail', handleOpenUpdateEmail);
    };
  }, []);

  // Prevent password manager detection
  useEffect(() => {
    const preventPasswordManager = () => {
      const sections = document.querySelectorAll('[data-1p-ignore]');
      sections.forEach(section => {
        const inputs = section.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (!input.hasAttribute('data-1p-ignore')) {
            input.setAttribute('data-1p-ignore', 'true');
            input.setAttribute('data-lpignore', 'true');
            input.setAttribute('data-form-type', 'other');
            input.setAttribute('autocomplete', 'off');
          }
        });
      });
    };

    preventPasswordManager();
    const interval = setInterval(preventPasswordManager, 1000);
    return () => clearInterval(interval);
  }, [activeSection, activeSubmenu]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
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
    { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
    { id: 'calendar', label: 'Calendar', icon: FaCalendar },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'payments', label: 'Payments', icon: FaDollarSign },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'profile', label: 'Profile & Settings', icon: FaUser },
  ];

  const signOutItem = { id: 'signout', label: 'Sign Out', icon: FaSignOutAlt };

  const submenuItems = {
    bookings: [
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'past', label: 'Past' },
      { id: 'canceled', label: 'Canceled' },
    ],
    favorites: [
      { id: 'providers', label: 'Saved Providers' },
    ],
    payments: [
      { id: 'receipts', label: 'Payment History' },
    ],
    calendar: [
      { id: 'view', label: 'Calendar View' },
    ],
    messages: [
      { id: 'inbox', label: 'Inbox' },
      { id: 'starred', label: 'Starred' },
      { id: 'sent', label: 'Sent' },
      { id: 'trash', label: 'Trash' },
    ],
    profile: [
      { id: 'personal', label: 'Personal Info' },
      { id: 'preferences', label: 'Preferences' },
      { id: 'account', label: 'Account Settings' },
    ],
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <Bookings activeSubmenu={activeSubmenu} />;
      case 'favorites':
        return <Favorites activeSubmenu={activeSubmenu} />;
      case 'payments':
        return <Payments activeSubmenu={activeSubmenu} />;
      case 'calendar':
        return <Calendar activeSubmenu={activeSubmenu} />;
      case 'messages':
        return <Messages activeSubmenu={activeSubmenu} />;
      case 'profile':
        return (
          <>
            {needsProfileCompletion && (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                    Complete Your Profile
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Please fill in your phone number and address to start booking services.
                  </p>
                </div>
              </div>
            )}
            <Profile activeSubmenu={activeSubmenu} />
          </>
        );
      default:
        return <Bookings activeSubmenu={activeSubmenu} />;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Left Sidebar */}
      <div className={`${styles.sidebar} ${sidebarExpanded ? styles.expanded : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <button 
            className={styles.toggleButton}
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label="Toggle sidebar"
          >
            {sidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  // Automatically set the first submenu item as active
                  const firstSubmenu = submenuItems[item.id as keyof typeof submenuItems]?.[0];
                  if (firstSubmenu) {
                    setActiveSubmenu(firstSubmenu.id);
                  }
                }}
                title={sidebarExpanded ? '' : item.label}
              >
                <IconComponent className={styles.sidebarIcon} />
                {sidebarExpanded && (
                  <>
                    <span className={styles.sidebarLabel}>{item.label}</span>
                    {item.id === 'messages' && unreadMessages > 0 && (
                      <span className={styles.badge}>{unreadMessages}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Sign Out at Bottom */}
        <div className={styles.sidebarFooter}>
          <button
            className={`${styles.sidebarItem} ${styles.signOutButton}`}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/');
            }}
            title={sidebarExpanded ? '' : signOutItem.label}
          >
            <signOutItem.icon className={styles.sidebarIcon} />
            {sidebarExpanded && <span className={styles.sidebarLabel}>{signOutItem.label}</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent} style={{ marginLeft: sidebarExpanded ? '240px' : '80px' }}>
        {/* Top Navigation */}
        <div className={styles.topNav}>
          <div className={styles.greetingSection}>
            <div className={styles.profileImageContainer} onClick={handleImageClick}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileInitials}>
                  {getInitials(userName)}
                </div>
              )}
            </div>
            <div className={styles.greetingInfo}>
              <div className={styles.greetingRow}>
                <h1 className={styles.greeting}>Hello, {userName}</h1>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.bookings}>{totalBookings} {totalBookings === 1 ? 'booking' : 'bookings'}</span>
                <Link 
                  href={`/clients/${userId}`}
                  className={styles.profileLink}
                  target="_blank"
                >
                  View your profile on Omvira
                </Link>
              </div>
            </div>
          </div>
          
          <div className={styles.topNavRight}>
            <Link href="/search" className={styles.findProviderBtn}>
              Book a Provider
            </Link>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Submenu Navigation */}
        <div className={styles.submenu}>
          {submenuItems[activeSection as keyof typeof submenuItems]?.map((item) => (
            <button
              key={item.id}
              className={`${styles.submenuItem} ${activeSubmenu === item.id ? styles.active : ''}`}
              onClick={() => setActiveSubmenu(item.id)}
            >
              {item.label}
              {activeSection === 'messages' && item.id === 'inbox' && unreadMessages > 0 && (
                <span className={styles.badge}>{unreadMessages}</span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {renderMainContent()}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={() => {
          // Dispatch event to refresh profile data if needed
          window.dispatchEvent(new Event('profileUpdated'));
        }}
      />

      {/* Update Email Modal */}
      <UpdateEmailModal
        isOpen={showUpdateEmailModal}
        onClose={() => setShowUpdateEmailModal(false)}
        currentEmail={userEmail}
        onSuccess={() => {
          // Dispatch event to refresh profile data
          window.dispatchEvent(new Event('profileUpdated'));
        }}
      />
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    }>
      <ClientDashboardContent />
    </Suspense>
  );
}

