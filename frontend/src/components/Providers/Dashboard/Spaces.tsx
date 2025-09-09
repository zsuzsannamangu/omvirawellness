'use client';

import { FaCheckCircle, FaTimesCircle, FaStar, FaUser, FaCalendarAlt, FaClock, FaDollarSign, FaSearch, FaPlus, FaHeart } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface SpacesProps {
  activeSubmenu: string;
}

export default function Spaces({ activeSubmenu }: SpacesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'upcoming':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Upcoming Space Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>20</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Yoga Studio Rental</h4>
                  <p className={styles.compactClient}>Zen Wellness Center • 9:00 AM - 11:00 AM • $150</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>25</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Meditation Room</h4>
                  <p className={styles.compactClient}>Peaceful Space • 2:00 PM - 4:00 PM • $80</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Favorite Spaces</h2>
            
            <div className={styles.favoritesGrid}>
              <div className={styles.favoriteCard}>
                <div className={styles.favoriteImage}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.favoriteInfo}>
                  <h4 className={styles.favoriteName}>Zen Wellness Studio</h4>
                  <p className={styles.favoriteLocation}>123 Wellness Way, San Francisco</p>
                  <div className={styles.favoriteRating}>
                    <FaStar /> 4.8 (23 reviews)
                  </div>
                  <div className={styles.favoritePrice}>$120/hour</div>
                </div>
                <div className={styles.favoriteActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.favoriteCard}>
                <div className={styles.favoriteImage}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.favoriteInfo}>
                  <h4 className={styles.favoriteName}>Peaceful Meditation Room</h4>
                  <p className={styles.favoriteLocation}>456 Serenity St, San Francisco</p>
                  <div className={styles.favoriteRating}>
                    <FaStar /> 4.9 (15 reviews)
                  </div>
                  <div className={styles.favoritePrice}>$80/hour</div>
                </div>
                <div className={styles.favoriteActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.favoriteCard}>
                <div className={styles.favoriteImage}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.favoriteInfo}>
                  <h4 className={styles.favoriteName}>Professional Conference Room</h4>
                  <p className={styles.favoriteLocation}>789 Business Ave, San Francisco</p>
                  <div className={styles.favoriteRating}>
                    <FaStar /> 4.7 (31 reviews)
                  </div>
                  <div className={styles.favoritePrice}>$100/hour</div>
                </div>
                <div className={styles.favoriteActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Past Space Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>10</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Conference Room</h4>
                  <p className={styles.compactClient}>Business Center • 10:00 AM - 12:00 PM • $200</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCompleted}>Completed</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>5</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Wellness Studio</h4>
                  <p className={styles.compactClient}>Healing Hub • 3:00 PM - 5:00 PM • $120</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCompleted}>Completed</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'request':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Request a Space</h2>
            
            <div className={styles.requestForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Space Requirements</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Space Type</label>
                    <select className={styles.formSelect} defaultValue="">
                      <option value="">Select space type</option>
                      <option value="yoga">Yoga Studio</option>
                      <option value="meditation">Meditation Room</option>
                      <option value="conference">Conference Room</option>
                      <option value="wellness">Wellness Studio</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Capacity</label>
                    <select className={styles.formSelect} defaultValue="">
                      <option value="">Select capacity</option>
                      <option value="1-5">1-5 people</option>
                      <option value="6-10">6-10 people</option>
                      <option value="11-20">11-20 people</option>
                      <option value="20+">20+ people</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Date</label>
                    <input type="date" className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Duration (hours)</label>
                    <select className={styles.formSelect} defaultValue="">
                      <option value="">Select duration</option>
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="8">8 hours</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Special Requirements</label>
                  <textarea className={styles.formTextarea} rows={3} placeholder="Describe any special requirements or equipment needed..."></textarea>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.primaryBtn}>Submit Request</button>
                <button className={styles.secondaryBtn}>Save as Draft</button>
              </div>
            </div>
          </div>
        );

      case 'find':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Find a Space</h2>
            
            <div className={styles.searchForm}>
              <div className={styles.searchBar}>
                <div className={styles.searchInput}>
                  <FaSearch />
                  <input type="text" placeholder="Search by location, space type, or amenities..." />
                </div>
                <button className={styles.searchBtn}>Search</button>
              </div>
              
              <div className={styles.searchFilters}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Space Type</label>
                  <select className={styles.filterSelect}>
                    <option value="">All Types</option>
                    <option value="yoga">Yoga Studio</option>
                    <option value="meditation">Meditation Room</option>
                    <option value="conference">Conference Room</option>
                    <option value="wellness">Wellness Studio</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Price Range</label>
                  <select className={styles.filterSelect}>
                    <option value="">Any Price</option>
                    <option value="0-50">$0 - $50/hour</option>
                    <option value="50-100">$50 - $100/hour</option>
                    <option value="100-200">$100 - $200/hour</option>
                    <option value="200+">$200+/hour</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Date</label>
                  <input type="date" className={styles.filterInput} />
                </div>
              </div>
            </div>

            <div className={styles.spacesGrid}>
              <div className={styles.spaceCard}>
                <div className={styles.spaceImage}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.spaceInfo}>
                  <h4 className={styles.spaceName}>Zen Wellness Studio</h4>
                  <p className={styles.spaceLocation}>123 Wellness Way, San Francisco</p>
                  <div className={styles.spaceRating}>
                    <FaStar /> 4.8 (23 reviews)
                  </div>
                  <div className={styles.spacePrice}>$120/hour</div>
                  <div className={styles.spaceAmenities}>
                    <span className={styles.amenity}>WiFi</span>
                    <span className={styles.amenity}>Parking</span>
                    <span className={styles.amenity}>Equipment</span>
                  </div>
                </div>
                <div className={styles.spaceActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.favoriteBtn}>Save</button>
                </div>
              </div>

              <div className={styles.spaceCard}>
                <div className={styles.spaceImage}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.spaceInfo}>
                  <h4 className={styles.spaceName}>Peaceful Meditation Room</h4>
                  <p className={styles.spaceLocation}>456 Serenity St, San Francisco</p>
                  <div className={styles.spaceRating}>
                    <FaStar /> 4.9 (15 reviews)
                  </div>
                  <div className={styles.spacePrice}>$80/hour</div>
                  <div className={styles.spaceAmenities}>
                    <span className={styles.amenity}>Quiet</span>
                    <span className={styles.amenity}>Cushions</span>
                    <span className={styles.amenity}>Timer</span>
                  </div>
                </div>
                <div className={styles.spaceActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.favoriteBtn}>Save</button>
                </div>
              </div>

              <div className={styles.spaceCard}>
                <div className={styles.spaceImage}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.spaceInfo}>
                  <h4 className={styles.spaceName}>Professional Conference Room</h4>
                  <p className={styles.spaceLocation}>789 Business Ave, San Francisco</p>
                  <div className={styles.spaceRating}>
                    <FaStar /> 4.7 (31 reviews)
                  </div>
                  <div className={styles.spacePrice}>$100/hour</div>
                  <div className={styles.spaceAmenities}>
                    <span className={styles.amenity}>Projector</span>
                    <span className={styles.amenity}>Whiteboard</span>
                    <span className={styles.amenity}>WiFi</span>
                  </div>
                </div>
                <div className={styles.spaceActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.favoriteBtn}>Save</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Space Rentals</h2>
            <div className={styles.placeholderText}>
              <p>Manage your space rental bookings and preferences.</p>
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
