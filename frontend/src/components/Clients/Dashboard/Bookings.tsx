'use client';

import { FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'upcoming':
        return (
          <div className={styles.upcomingContent}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <div className={styles.sessionsList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>15</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Massage Therapy</h4>
                  <p className={styles.sessionProvider}>with Sarah Johnson</p>
                  <p className={styles.sessionTime}>2:00 PM - 3:00 PM</p>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Reschedule</button>
                  <button className={styles.actionBtn}>Cancel</button>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>18</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Yoga Class</h4>
                  <p className={styles.sessionProvider}>with Mike Chen</p>
                  <p className={styles.sessionTime}>10:00 AM - 11:00 AM</p>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Reschedule</button>
                  <button className={styles.actionBtn}>Cancel</button>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>22</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Meditation Session</h4>
                  <p className={styles.sessionProvider}>with Lisa Wang</p>
                  <p className={styles.sessionTime}>7:00 PM - 8:00 PM</p>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Reschedule</button>
                  <button className={styles.actionBtn}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'book-new':
        return (
          <div className={styles.bookNewContent}>
            <h2 className={styles.sectionTitle}>Book New Appointment</h2>
            
            <div className={styles.bookingSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Choose Service</h3>
                  <div className={styles.serviceDropdown}>
                    <select className={styles.serviceSelect}>
                      <option value="">Select a service</option>
                      <option value="massage">Massage Therapy</option>
                      <option value="yoga">Yoga Class</option>
                      <option value="meditation">Meditation</option>
                      <option value="training">Personal Training</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Select Provider</h3>
                  <div className={styles.providerDropdown}>
                    <select className={styles.providerSelect}>
                      <option value="">Select a provider</option>
                      <option value="sarah">Sarah Johnson - Massage Therapist - ⭐ 4.9</option>
                      <option value="mike">Mike Chen - Yoga Instructor - ⭐ 4.8</option>
                      <option value="lisa">Lisa Wang - Meditation Guide - ⭐ 4.7</option>
                      <option value="david">David Kim - Personal Trainer - ⭐ 4.9</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Choose Date & Time</h3>
                  <div className={styles.datetimeRow}>
                    <div className={styles.dateField}>
                      <label className={styles.fieldLabel}>Date</label>
                      <input type="date" className={styles.dateInput} />
                    </div>
                    <div className={styles.timeField}>
                      <label className={styles.fieldLabel}>Time</label>
                      <select className={styles.timeSelect}>
                        <option value="">Select time</option>
                        <option value="9:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="2:00">2:00 PM</option>
                        <option value="3:00">3:00 PM</option>
                        <option value="4:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Review & Confirm</h3>
                  <div className={styles.confirmLayout}>
                    <div className={styles.bookingSummary}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Service:</span>
                        <span className={styles.summaryValue}>Massage Therapy</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Provider:</span>
                        <span className={styles.summaryValue}>Sarah Johnson</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Date:</span>
                        <span className={styles.summaryValue}>Dec 20, 2024</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Time:</span>
                        <span className={styles.summaryValue}>2:00 PM - 3:00 PM</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Duration:</span>
                        <span className={styles.summaryValue}>60 minutes</span>
                      </div>
                      <div className={styles.summaryTotal}>
                        <span className={styles.summaryLabel}>Total:</span>
                        <span className={styles.summaryValue}>$120</span>
                      </div>
                    </div>
                    <div className={styles.confirmActions}>
                      <button className={styles.confirmBookingBtn}>Confirm Booking</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.pastContent}>
            <h2 className={styles.sectionTitle}>Past Appointments</h2>
            <div className={styles.sessionsList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>10</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Massage Therapy</h4>
                  <p className={styles.sessionProvider}>with Sarah Johnson</p>
                  <p className={styles.sessionTime}>2:00 PM - 3:00 PM</p>
                  <div className={styles.sessionStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                    <span className={styles.sessionRating}><FaStar /> 5.0</span>
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Leave Review</button>
                  <button className={styles.bookAgainBtn}>Book Again</button>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>8</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Yoga Class</h4>
                  <p className={styles.sessionProvider}>with Mike Chen</p>
                  <p className={styles.sessionTime}>10:00 AM - 11:00 AM</p>
                  <div className={styles.sessionStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                    <span className={styles.sessionRating}><FaStar /> 4.8</span>
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Leave Review</button>
                  <button className={styles.bookAgainBtn}>Book Again</button>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>5</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Meditation Session</h4>
                  <p className={styles.sessionProvider}>with Lisa Wang</p>
                  <p className={styles.sessionTime}>7:00 PM - 8:00 PM</p>
                  <div className={styles.sessionStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                    <span className={styles.sessionRating}><FaStar /> 4.9</span>
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Leave Review</button>
                  <button className={styles.bookAgainBtn}>Book Again</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'canceled':
        return (
          <div className={styles.canceledContent}>
            <h2 className={styles.sectionTitle}>Canceled Appointments</h2>
            <div className={styles.sessionsList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>12</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Personal Training</h4>
                  <p className={styles.sessionProvider}>with David Kim</p>
                  <p className={styles.sessionTime}>3:00 PM - 4:00 PM</p>
                  <div className={styles.sessionStatus}>
                    <span className={styles.statusCanceled}>Canceled</span>
                    <span className={styles.cancelReason}>Client requested</span>
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.bookAgainBtn}>Book Again</button>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>6</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Massage Therapy</h4>
                  <p className={styles.sessionProvider}>with Sarah Johnson</p>
                  <p className={styles.sessionTime}>1:00 PM - 2:00 PM</p>
                  <div className={styles.sessionStatus}>
                    <span className={styles.statusCanceled}>Canceled</span>
                    <span className={styles.cancelReason}>Provider unavailable</span>
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.bookAgainBtn}>Book Again</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
