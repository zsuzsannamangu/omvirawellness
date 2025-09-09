'use client';

import { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import ManageListing from './ManageListing';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface SpacesProps {
  activeSubmenu: string;
}

export default function Spaces({ activeSubmenu }: SpacesProps) {
  const [showManageListing, setShowManageListing] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isNewListing, setIsNewListing] = useState(false);

  const handleManageListing = (listingId: string) => {
    setSelectedListingId(listingId);
    setIsNewListing(false);
    setShowManageListing(true);
  };

  const handleAddNewListing = () => {
    setSelectedListingId('new');
    setIsNewListing(true);
    setShowManageListing(true);
  };

  const handleBackToListings = () => {
    setShowManageListing(false);
    setSelectedListingId(null);
    setIsNewListing(false);
  };

  if (showManageListing) {
    return (
      <ManageListing 
        listingId={selectedListingId || 'new'} 
        onBack={handleBackToListings}
        isNewListing={isNewListing}
      />
    );
  }
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'listings':
        return (
          <div className={styles.dashboardSection}>
            <div className={styles.addListingSection}>
              <button className={styles.addListingBtn} onClick={handleAddNewListing}>Add New Listing</button>
            </div>
            
            <div className={styles.listingsGrid}>
              <div className={styles.listingCard}>
                <div className={styles.listingImage}>
                  <FaHome />
                </div>
                <div className={styles.listingInfo}>
                  <h3 className={styles.listingName}>Yoga Studio</h3>
                  <p className={styles.listingDescription}>Spacious yoga studio with natural lighting and mirrors</p>
                  <div className={styles.listingStatus}>
                    <span className={styles.statusActive}>Active</span>
                    <span className={styles.listingPrice}>$120/hour</span>
                  </div>
                </div>
                <button 
                  className={styles.manageListingBtn}
                  onClick={() => handleManageListing('yoga-studio')}
                >
                  Manage Listing
                </button>
              </div>

              <div className={styles.listingCard}>
                <div className={styles.listingImage}>
                  <FaHome />
                </div>
                <div className={styles.listingInfo}>
                  <h3 className={styles.listingName}>Meditation Room</h3>
                  <p className={styles.listingDescription}>Quiet meditation space with comfortable seating</p>
                  <div className={styles.listingStatus}>
                    <span className={styles.statusActive}>Active</span>
                    <span className={styles.listingPrice}>$80/hour</span>
                  </div>
                </div>
                <button 
                  className={styles.manageListingBtn}
                  onClick={() => handleManageListing('meditation-room')}
                >
                  Manage Listing
                </button>
              </div>

              <div className={styles.listingCard}>
                <div className={styles.listingImage}>
                  <FaHome />
                </div>
                <div className={styles.listingInfo}>
                  <h3 className={styles.listingName}>Conference Room</h3>
                  <p className={styles.listingDescription}>Professional meeting space with AV equipment</p>
                  <div className={styles.listingStatus}>
                    <span className={styles.statusInactive}>Inactive</span>
                    <span className={styles.listingPrice}>$60/hour</span>
                  </div>
                </div>
                <button 
                  className={styles.manageListingBtn}
                  onClick={() => handleManageListing('conference-room')}
                >
                  Manage Listing
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Listings</h2>
            <div className={styles.placeholderText}>
              <p>Manage your space listings.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.content}>
      {renderContent()}
    </div>
  );
}