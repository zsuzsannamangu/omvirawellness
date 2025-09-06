'use client';

import { useState, useRef } from 'react';
import styles from '@/styles/Providers/Dashboard.module.scss';

// Dashboard sections
import Overview from '@/components/Providers/Dashboard/Overview';
import Bookings from '@/components/Providers/Dashboard/Bookings';
import Calendar from '@/components/Providers/Dashboard/Calendar';
import Clients from '@/components/Providers/Dashboard/Clients';
import Analytics from '@/components/Providers/Dashboard/Analytics';
import Settings from '@/components/Providers/Dashboard/Settings';

export default function ProvidersDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubmenu, setActiveSubmenu] = useState('dashboard');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [providerName] = useState('Sarah Johnson'); // This would come from provider data
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
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'clients', label: 'Clients' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  const submenuItems = {
    overview: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'recent', label: 'Recent Activity' },
    ],
    bookings: [
      { id: 'upcoming', label: 'Upcoming Sessions' },
      { id: 'pending', label: 'Pending Requests' },
      { id: 'history', label: 'Session History' },
    ],
    calendar: [
      { id: 'calendar', label: 'Calendar View' },
      { id: 'availability', label: 'Availability' },
      { id: 'blocked', label: 'Blocked Times' },
    ],
    clients: [
      { id: 'clients', label: 'Client List' },
      { id: 'new', label: 'New Clients' },
      { id: 'notes', label: 'Client Notes' },
    ],
    analytics: [
      { id: 'revenue', label: 'Revenue' },
      { id: 'sessions', label: 'Sessions' },
      { id: 'reviews', label: 'Reviews & Ratings' },
    ],
    settings: [
      { id: 'profile', label: 'Profile' },
      { id: 'services', label: 'Services' },
      { id: 'pricing', label: 'Pricing' },
    ],
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview activeSubmenu={activeSubmenu} />;
      case 'bookings':
        return <Bookings activeSubmenu={activeSubmenu} />;
      case 'calendar':
        return <Calendar activeSubmenu={activeSubmenu} />;
      case 'clients':
        return <Clients activeSubmenu={activeSubmenu} />;
      case 'analytics':
        return <Analytics activeSubmenu={activeSubmenu} />;
      case 'settings':
        return <Settings activeSubmenu={activeSubmenu} />;
      default:
        return <Overview activeSubmenu={activeSubmenu} />;
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Omvira Providers</h2>
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
          <div className={styles.breadcrumb}>
            <h1 className={styles.pageTitle}>
              {sidebarItems.find(item => item.id === activeSection)?.label}
            </h1>
            <p className={styles.providerName}>{providerName}</p>
          </div>
          
          <div className={styles.topNavRight}>
            <button 
              className={styles.editProfileBtn}
              onClick={() => setActiveSection('settings')}
            >
              Edit Profile
            </button>
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
              <div className={styles.profileOverlay}>
                <span className={styles.profileEditIcon}>Edit</span>
              </div>
            </div>
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
