'use client';

import { useState } from 'react';
import ManageListing from './ManageListing';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface SpacesProps {
  activeSubmenu: string;
}

export default function Spaces({ activeSubmenu }: SpacesProps) {
  const [showManageListing, setShowManageListing] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isNewListing, setIsNewListing] = useState(false);

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
            
            <div className={styles.placeholderText}>
              <p>No listings yet. Create your first space listing to start accepting bookings.</p>
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
