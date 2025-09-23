'use client';

import { useState, useRef } from 'react';
import styles from '@/styles/Providers/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Providers/Dashboard/Bookings';
import Spaces from '@/components/Providers/Dashboard/Spaces';
import Calendar from '@/components/Providers/Dashboard/Calendar';
import Clients from '@/components/Providers/Dashboard/Clients';
import Payments from '@/components/Providers/Dashboard/Payments';
import Analytics from '@/components/Providers/Dashboard/Analytics';
import Messages from '@/components/Providers/Dashboard/Messages';
import Profile from '@/components/Providers/Dashboard/Profile';

export default function ProvidersDashboard() {
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('requests');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [providerName] = useState('Sarah Johnson'); // This would come from provider data
  const [providerRating] = useState(4.9); // This would come from provider data
  const [totalClients] = useState(156); // This would come from provider data
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
    { id: 'spaces', label: 'Space Rentals' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'clients', label: 'Clients' },
    { id: 'payments', label: 'Payments & Earnings' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile' },
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
      { id: 'directory', label: 'Directory of Past Clients' },
      { id: 'notes', label: 'Notes & Preferences' },
    ],
    payments: [
      { id: 'balance', label: 'Balance Overview' },
      { id: 'payouts', label: 'Payouts' },
      { id: 'reports', label: 'Reports' },
    ],
    analytics: [
      { id: 'bookings', label: 'Bookings' },
      { id: 'revenue', label: 'Revenue Trends' },
      { id: 'retention', label: 'Retention' },
    ],
    messages: [
      { id: 'communication', label: 'Client Communication' },
      { id: 'reminders', label: 'Reminders' },
    ],
    profile: [
      { id: 'services', label: 'Service Menu' },
      { id: 'availability', label: 'Availability' },
      { id: 'bio', label: 'Bio' },
      { id: 'certifications', label: 'Certifications' },
    ],
    settings: [
      { id: 'account', label: 'Account Information' },
      { id: 'security', label: 'Security' },
      { id: 'notifications', label: 'Notifications' },
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
      case 'analytics':
        return <Analytics activeSubmenu={activeSubmenu} />;
      case 'messages':
        return <Messages activeSubmenu={activeSubmenu} />;
      case 'profile':
        return <Profile activeSubmenu={activeSubmenu} />;
      case 'settings':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
            <div className={styles.placeholderText}>
              <p>Account Settings will be implemented soon.</p>
              <p>This section will include account information, security settings, notifications, and billing preferences.</p>
            </div>
          </div>
        );
      default:
        return <Bookings activeSubmenu={activeSubmenu} />;
    }
  };

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
                  // Handle sign out action
                  console.log('Sign out clicked');
                  // Add your sign out logic here
                } else {
                  setActiveSection(item.id);
                  // Set the first submenu item as default for each section
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
              <h1 className={styles.greeting}>Hello, {providerName}</h1>
              <div className={styles.userStats}>
                <span className={styles.rating}>★ {providerRating} (47 reviews)</span>
                <span className={styles.clients}>{totalClients} clients</span>
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
