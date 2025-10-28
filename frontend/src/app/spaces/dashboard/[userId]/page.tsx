'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/Spaces/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Spaces/Dashboard/Bookings';
import Calendar from '@/components/Spaces/Dashboard/Calendar';
import Payments from '@/components/Spaces/Dashboard/Payments';
import Spaces from '@/components/Spaces/Dashboard/Spaces';
import Analytics from '@/components/Spaces/Dashboard/Analytics';
import Messages from '@/components/Spaces/Dashboard/Messages';
import Profile from '@/components/Spaces/Dashboard/Profile';

export default function SpacesDashboard() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('upcoming');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [spaceName] = useState('Zen Wellness Studio');
  const [spaceRating] = useState(4.7);
  const [totalBookings] = useState(89);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/spaces/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      // Verify the userId matches the logged-in user
      if (userData.id !== userId) {
        console.error('User ID mismatch');
        router.push('/spaces/login');
        return;
      }
      
      // Verify user is a space owner
      if (userData.user_type !== 'space_owner') {
        router.push('/spaces/login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/spaces/login');
      return;
    }
    
    setLoading(false);
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
    { id: 'calendar', label: 'Calendar' },
    { id: 'payments', label: 'Payments' },
    { id: 'spaces', label: 'Listings' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile & Settings' },
    { id: 'signout', label: 'Sign Out' },
  ];

  const submenuItems = {
    bookings: [
      { id: 'requests', label: 'Requests' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'past', label: 'Past' },
      { id: 'canceled', label: 'Canceled' },
    ],
    calendar: [
      { id: 'calendar', label: 'Calendar View' },
    ],
    payments: [
      { id: 'earnings', label: 'Earnings' },
      { id: 'payouts', label: 'Payout History' },
    ],
    spaces: [
      { id: 'listings', label: 'Listings' },
    ],
    analytics: [
      { id: 'occupancy', label: 'Occupancy Rates' },
      { id: 'revenue', label: 'Revenue Insights' },
    ],
    messages: [
      { id: 'inquiries', label: 'Inquiries' },
      { id: 'confirmations', label: 'Confirmations' },
    ],
    profile: [
      { id: 'host', label: 'Host Info' },
      { id: 'policies', label: 'Policies' },
      { id: 'instructions', label: 'Instructions' },
    ],
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <Bookings activeSubmenu={activeSubmenu} />;
      case 'calendar':
        return <Calendar activeSubmenu={activeSubmenu} />;
      case 'payments':
        return <Payments activeSubmenu={activeSubmenu} />;
      case 'spaces':
        return <Spaces activeSubmenu={activeSubmenu} />;
      case 'analytics':
        return <Analytics activeSubmenu={activeSubmenu} />;
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
          <h2 className={styles.logo}>Rental Manager</h2>
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
                  router.push('/spaces');
                } else {
                  setActiveSection(item.id);
                  const firstSubmenu = submenuItems[item.id as keyof typeof submenuItems]?.[0];
                  setActiveSubmenu(firstSubmenu?.id || item.id);
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
                  alt="Space Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileInitials}>
                  {getInitials(spaceName)}
                </div>
              )}
            </div>
            <div className={styles.greetingInfo}>
              <h1 className={styles.greeting}>Hello, {spaceName}</h1>
              <div className={styles.userStats}>
                <span className={styles.rating}>★ {spaceRating} (23 reviews)</span>
                <span className={styles.bookings}>{totalBookings} bookings</span>
                <span className={styles.profileLink}>View your profile on Omvira</span>
              </div>
            </div>
          </div>
          
          <div className={styles.topNavRight}>
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

