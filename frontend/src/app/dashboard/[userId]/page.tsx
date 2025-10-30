'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/Clients/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Clients/Dashboard/Bookings';
import Favorites from '@/components/Clients/Dashboard/Favorites';
import Payments from '@/components/Clients/Dashboard/Payments';
import Calendar from '@/components/Clients/Dashboard/Calendar';
import Messages from '@/components/Clients/Dashboard/Messages';
import Profile from '@/components/Clients/Dashboard/Profile';

export default function ClientDashboard() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('upcoming');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('User'); // Will be loaded from user data
  const [userRating] = useState(4.8);
  const [totalBookings] = useState(24);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserData = () => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
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
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
        return;
      }
      
      setLoading(false);
    };

    loadUserData();

    // Listen for profile update events to refresh name
    const handleProfileUpdate = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.profile?.first_name && userData.profile?.last_name) {
            setUserName(`${userData.profile.first_name} ${userData.profile.last_name}`);
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
    { id: 'bookings', label: 'Bookings' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'payments', label: 'Payments' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile & Preferences' },
    { id: 'signout', label: 'Sign Out' },
  ];

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
      { id: 'methods', label: 'Payment Methods' },
      { id: 'receipts', label: 'Payment History' },
    ],
    calendar: [
      { id: 'view', label: 'Calendar View' },
    ],
    messages: [
      { id: 'confirmations', label: 'Confirmations' },
      { id: 'direct', label: 'Direct Communication' },
    ],
    profile: [
      { id: 'personal', label: 'Personal Info' },
      { id: 'preferences', label: 'Preferences' },
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
        return <Profile activeSubmenu={activeSubmenu} />;
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
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Client Dashboard</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => {
                if (item.id === 'signout') {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/');
                } else {
                  setActiveSection(item.id);
                  // Automatically set the first submenu item as active
                  const firstSubmenu = submenuItems[item.id as keyof typeof submenuItems]?.[0];
                  if (firstSubmenu) {
                    setActiveSubmenu(firstSubmenu.id);
                  }
                }
              }}
            >
              <span className={styles.sidebarLabel}>{item.label}</span>
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
                <span className={styles.rating}>★ {userRating} (12 reviews)</span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.bookings}>{totalBookings} bookings</span>
                <span className={styles.profileLink}>View your profile on Omvira</span>
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
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

