'use client';

import { useState } from 'react';
import styles from '@/styles/Clients/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Clients/Dashboard/Bookings';
import History from '@/components/Clients/Dashboard/History';
import Payments from '@/components/Clients/Dashboard/Payments';
import Profile from '@/components/Clients/Dashboard/Profile';

export default function ClientDashboard() {
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('upcoming');

  const sidebarItems = [
    { id: 'bookings', label: 'Bookings' },
    { id: 'history', label: 'History' },
    { id: 'payments', label: 'Payments' },
    { id: 'profile', label: 'Profile' },
  ];

  const submenuItems = {
    bookings: [
      { id: 'upcoming', label: 'Upcoming Appointments' },
      { id: 'book-new', label: 'Book New' },
    ],
    history: [
      { id: 'history', label: 'History' },
      { id: 'completed', label: 'Completed' },
      { id: 'cancelled', label: 'Cancelled' },
    ],
    payments: [
      { id: 'payments', label: 'Payments' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'invoices', label: 'Invoices' },
    ],
    profile: [
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' },
      { id: 'preferences', label: 'Preferences' },
    ],
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <Bookings activeSubmenu={activeSubmenu} />;
      case 'history':
        return <History activeSubmenu={activeSubmenu} />;
      case 'payments':
        return <Payments activeSubmenu={activeSubmenu} />;
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
          <h2 className={styles.logo}>Omvira Wellness</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setActiveSubmenu(item.id);
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
          </div>
          
          <div className={styles.topNavRight}>
            <button className={styles.settingsBtn}>
              Go to settings
            </button>
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
