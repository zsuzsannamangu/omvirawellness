'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [activeSection, setActiveSection] = useState('bookings');
  const [activeSubmenu, setActiveSubmenu] = useState('requests');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('Loading...');
  const [providerRating] = useState(4.9);
  const [totalClients] = useState(156);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/providers/login');
      return;
    }
    
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
      if (userData.profile?.contact_name) {
        setProviderName(userData.profile.contact_name);
      } else if (userData.profile?.business_name) {
        setProviderName(userData.profile.business_name);
      } else if (userData.email) {
        setProviderName(userData.email.split('@')[0]);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/providers/login');
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
      case 'analytics':
        return <Analytics activeSubmenu={activeSubmenu} />;
      case 'messages':
        return <Messages activeSubmenu={activeSubmenu} />;
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
                      <input type="email" className={styles.formInput} defaultValue={email} disabled />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Password</label>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input 
                          type="password" 
                          className={styles.formInput} 
                          defaultValue="••••••••" 
                          disabled 
                          style={{ flex: 1, opacity: 0.5 }}
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
                
                <div className={styles.settingsForm}>
                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Current Plan</label>
                      <div className={styles.planInfo}>
                        <span className={styles.planName}>Professional Plan</span>
                        <span className={styles.planPrice}>$59/month</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Billing Cycle</label>
                      <input type="text" className={styles.formInput} defaultValue="Monthly" disabled />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button className={styles.saveBtn}>Change Plan</button>
                    <button className={styles.cancelBtn}>Cancel Subscription</button>
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
                      <input type="text" className={styles.formInput} placeholder="**** **** **** 1234" disabled />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Expiry Date</label>
                        <input type="text" className={styles.formInput} placeholder="MM/YY" />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>CVV</label>
                        <input type="text" className={styles.formInput} placeholder="***" />
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
          <h2 className={styles.logo}>Provider Dashboard</h2>
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
                  router.push('/providers');
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

