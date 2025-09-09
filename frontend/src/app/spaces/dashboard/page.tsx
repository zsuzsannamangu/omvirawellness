'use client';

import { useState, useRef } from 'react';
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
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('upcoming');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [spaceName] = useState('Zen Wellness Studio'); // This would come from space data
  const [spaceRating] = useState(4.7); // This would come from space data
  const [totalBookings] = useState(89); // This would come from space data
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    { id: 'spaces', label: 'Spaces' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile & Settings' },
  ];

  const submenuItems = {
    bookings: [
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'past', label: 'Past' },
      { id: 'canceled', label: 'Canceled' },
    ],
    calendar: [
      { id: 'availability', label: 'Availability' },
      { id: 'reservations', label: 'Reservations' },
    ],
    payments: [
      { id: 'earnings', label: 'Earnings' },
      { id: 'payouts', label: 'Payout History' },
    ],
    spaces: [
      { id: 'listings', label: 'Manage Listings' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'photos', label: 'Photos' },
      { id: 'amenities', label: 'Amenities' },
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
                setActiveSection(item.id);
                // Set the first submenu item as default for each section
                const firstSubmenu = submenuItems[item.id as keyof typeof submenuItems]?.[0];
                setActiveSubmenu(firstSubmenu?.id || item.id);
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
            <button className={styles.signOutBtn}>Sign Out</button>
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
