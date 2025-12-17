'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaPaperPlane, FaClock, FaUser, FaBell, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  booking_id: string | null;
  is_read: boolean;
  created_at: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (activeSubmenu === 'notifications') {
      loadNotifications();
    }
  }, [activeSubmenu]);

  // Listen for booking updates to refresh notifications
  useEffect(() => {
    const handleRefresh = () => {
      if (activeSubmenu === 'notifications') {
        loadNotifications();
      }
    };
    window.addEventListener('refreshBookings', handleRefresh);
    return () => window.removeEventListener('refreshBookings', handleRefresh);
  }, [activeSubmenu]);

  const loadNotifications = async () => {
    setLoading(true);
    setSelectedIds([]); // Clear selection when reloading
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      console.log('Loading notifications...');
      const [notificationsRes, countRes] = await Promise.all([
        fetch('http://localhost:4000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:4000/api/notifications/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        console.log('Notifications loaded:', data);
        setNotifications(data);
      } else {
        const errorText = await notificationsRes.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error', status: notificationsRes.status };
        }
        console.error('Error fetching notifications:', errorData);
        console.error('Response status:', notificationsRes.status);
        console.error('Response text:', errorText);
      }

      if (countRes.ok) {
        const countData = await countRes.json();
        console.log('Unread count:', countData.count);
        setUnreadCount(countData.count || 0);
        // Trigger event to update badge in parent dashboard
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
      } else {
        const errorText = await countRes.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error', status: countRes.status };
        }
        console.error('Error fetching unread count:', errorData);
        console.error('Response status:', countRes.status);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:4000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => {
          const newCount = Math.max(0, prev - 1);
          window.dispatchEvent(new CustomEvent('refreshNotifications'));
          return newCount;
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedIds(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const deleteSelectedNotifications = async () => {
    if (selectedIds.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/notifications/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds: selectedIds })
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
        setSelectedIds([]);
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
        // Reload to update unread count
        loadNotifications();
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'notifications':
        return (
          <div className={styles.dashboardSection}>
            <div className={styles.notificationsHeader}>
              <h2 className={styles.sectionTitle}>Notifications</h2>
              <div className={styles.notificationsActions}>
                <button 
                  onClick={loadNotifications}
                  className={`${styles.secondaryBtn} ${styles.notificationButton}`}
                >
                  Refresh
                </button>
                {selectedIds.length > 0 ? (
                  <button 
                    onClick={deleteSelectedNotifications}
                    className={`${styles.deleteBtn} ${styles.notificationButton}`}
                  >
                    Delete ({selectedIds.length})
                  </button>
                ) : unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className={`${styles.secondaryBtn} ${styles.notificationButton}`}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className={styles.placeholderText}>Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className={styles.placeholderText}>
                <p>No notifications yet.</p>
              </div>
            ) : (
              <>
                {notifications.length > 0 && (
                  <div className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === notifications.length}
                      onChange={toggleSelectAll}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>Select all</span>
                  </div>
                )}
                <div className={styles.notificationsList}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${!notification.is_read ? styles.unread : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(notification.id)}
                        onChange={() => toggleSelectNotification(notification.id)}
                        className={styles.notificationCheckbox}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div 
                        className={styles.notificationContent}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                        className={!notification.is_read ? styles.notificationItemClickable : styles.notificationItemDefault}
                      >
                        <div className={styles.notificationHeader}>
                          <h4 className={styles.notificationTitle}>{notification.title}</h4>
                          {!notification.is_read && <span className={styles.unreadDot}></span>}
                        </div>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <span className={styles.notificationTime}>{formatDate(notification.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      
      case 'communication':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Client Communication</h2>
            <div className={styles.placeholderText}>
              <p>No messages yet.</p>
            </div>
          </div>
        );
      
      case 'reminders':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reminders</h2>
            <div className={styles.placeholderText}>
              <p>No reminders set up yet.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.placeholderText}>
              <p>Manage all your client communications.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
