'use client';

import { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaPaperPlane, FaClock, FaUser, FaBell, FaCheckCircle, FaEdit, FaTrash, FaStar, FaEnvelopeOpen, FaReply, FaPlus, FaBold, FaItalic, FaUnderline, FaPaperclip } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';
import { API_URL } from '@/config/api';

interface MessagesProps {
  activeSubmenu: string;
  userId?: string;
}

interface Client {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
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

interface Message {
  id: string;
  subject: string;
  body: string;
  senderName: string;
  recipientName?: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isDeleted: boolean;
  folder: 'inbox' | 'sent' | 'trash';
}

export default function Messages({ activeSubmenu, userId }: MessagesProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [composeData, setComposeData] = useState({
    recipientId: '',
    recipientName: '',
    subject: '',
    body: ''
  });
  const [isReply, setIsReply] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messageBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch clients when compose window opens
  useEffect(() => {
    const fetchClients = async () => {
      if (showCompose && userId && clients.length === 0) {
        setLoadingClients(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/providers/${userId}/clients`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setClients(data);
          }
        } catch (error) {
          // Error fetching clients
        } finally {
          setLoadingClients(false);
        }
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompose, userId]);

  useEffect(() => {
    if (activeSubmenu === 'notifications') {
      loadNotifications();
    } else if (['inbox', 'starred', 'sent', 'trash'].includes(activeSubmenu)) {
      loadMessages();
      setSelectedMessageIds([]); // Clear selection when switching folders
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        return;
      }

      const [notificationsRes, countRes] = await Promise.all([
        fetch(`${API_URL}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/notifications/unread-count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data);
      }

      if (countRes.ok) {
        const countData = await countRes.json();
        setUnreadCount(countData.count || 0);
        // Trigger event to update badge in parent dashboard
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
      }
    } catch (error) {
      // Error loading notifications
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
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
      // Error marking notification as read
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
      }
    } catch (error) {
      // Error marking all as read
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

      const response = await fetch(`${API_URL}/notifications/bulk-delete`, {
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
      // Error deleting notifications
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // No authentication token found
        setMessagesLoading(false);
        setMessages([]);
        return;
      }

      const folderMap: { [key: string]: string } = {
        'inbox': 'inbox',
        'starred': 'starred',
        'sent': 'sent',
        'trash': 'trash'
      };

      const folder = folderMap[activeSubmenu] || 'inbox';
      const url = `${API_URL}/messages?folder=${folder}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform API response to Message interface
        // Backend already formats senderName and recipientName, so use them directly
        const transformedMessages: Message[] = data.map((msg: any) => {
          // Backend returns senderId and recipientId in camelCase, convert to string
          // Handle null/undefined cases properly
          let senderId = '';
          if (msg.senderId !== null && msg.senderId !== undefined) {
            senderId = String(msg.senderId);
          } else if (msg.sender_id !== null && msg.sender_id !== undefined) {
            senderId = String(msg.sender_id);
          }
          
          let recipientId = '';
          if (msg.recipientId !== null && msg.recipientId !== undefined) {
            recipientId = String(msg.recipientId);
          } else if (msg.recipient_id !== null && msg.recipient_id !== undefined) {
            recipientId = String(msg.recipient_id);
          }
          
          // Transforming message
          // Check senderId for inbox messages
          
          return {
            id: msg.id,
            subject: msg.subject,
            body: msg.body,
            senderName: msg.senderName || 'Unknown',
            recipientName: msg.recipientName,
            senderId: senderId,
            recipientId: recipientId,
            timestamp: msg.timestamp || msg.created_at,
            isRead: msg.isRead !== undefined ? msg.isRead : (msg.is_read || false),
            isStarred: msg.isStarred !== undefined ? msg.isStarred : (msg.is_starred || false),
            isDeleted: msg.isDeleted !== undefined ? msg.isDeleted : (msg.is_deleted || false),
            folder: msg.folder || 'inbox'
          };
        });
        setMessages(transformedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      // Error fetching messages
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if not already read
    if (!message.isRead) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messages/${message.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isRead: true })
        });

        if (response.ok) {
          setMessages(messages.map(msg => 
            msg.id === message.id ? { ...msg, isRead: true } : msg
          ));
          // Refresh unread count
          window.dispatchEvent(new CustomEvent('refreshMessages'));
        }
      } catch (error) {
        // Error marking message as read
      }
    }
  };

  const handleStar = async (messageId: string, currentStarred: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isStarred: !currentStarred })
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, isStarred: !currentStarred } : msg
        ));
      }
    } catch (error) {
      // Error updating star status
    }
  };

  const handleDelete = async (messageId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Message',
      text: 'Are you sure you want to delete this message?',
      showCancelButton: true,
      confirmButtonColor: '#8B7355',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: true })
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        loadMessages();
        window.dispatchEvent(new CustomEvent('refreshMessages'));
      }
    } catch (error) {
      // Error deleting message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete message.',
        confirmButtonColor: '#8B7355'
      });
    }
  };

  const handlePermanentDelete = async (messageId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Permanently Delete Message',
      text: 'Are you sure you want to permanently delete this message? This action cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#8B7355',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      // Error permanently deleting message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete message.',
        confirmButtonColor: '#8B7355'
      });
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const toggleSelectAllMessages = () => {
    const filtered = getFilteredMessages();
    if (selectedMessageIds.length === filtered.length) {
      setSelectedMessageIds([]);
    } else {
      setSelectedMessageIds(filtered.map(msg => msg.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessageIds.length === 0) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Messages?',
      text: `Are you sure you want to delete ${selectedMessageIds.length} message${selectedMessageIds.length > 1 ? 's' : ''}?`,
      showCancelButton: true,
      confirmButtonColor: '#8B7355',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const deletePromises = selectedMessageIds.map(messageId => {
          if (activeSubmenu === 'trash') {
            // Permanent delete
            return fetch(`${API_URL}/messages/${messageId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          } else {
            // Move to trash
            return fetch(`${API_URL}/messages/${messageId}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ isDeleted: true })
            });
          }
        });

        await Promise.all(deletePromises);
        setMessages(messages.filter(msg => !selectedMessageIds.includes(msg.id)));
        setSelectedMessageIds([]);
        window.dispatchEvent(new CustomEvent('refreshMessages'));
      } catch (error) {
        // Error deleting messages
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete messages. Please try again.',
          confirmButtonColor: '#8B7355'
        });
      }
    }
  };

  const formatText = (command: string, value?: string) => {
    if (!messageBodyRef.current) return;
    
    try {
      messageBodyRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        document.execCommand(command, false, value);
      }
    } catch (error) {
      // Error formatting text
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      
      // Process image files - convert to base64 and insert into message body
      // Only accept .jpg and .png files
      for (const file of newFiles) {
        // Check file size first
        if (file.size > MAX_FILE_SIZE) {
          try {
            Swal.fire({
              icon: 'error',
              title: 'File Too Large',
              text: `The file "${file.name}" is too large. Please send files that are 10MB or less.`,
              confirmButtonColor: '#8B7355'
            }).catch(() => {
              // Ignore errors if Swal is already closed or component unmounted
            });
          } catch (error) {
            // Ignore Swal errors
          }
          continue;
        }
        
        const isValidImage = file.type === 'image/jpeg' || 
                            file.type === 'image/jpg' || 
                            file.type === 'image/png' ||
                            file.name.toLowerCase().endsWith('.jpg') ||
                            file.name.toLowerCase().endsWith('.jpeg') ||
                            file.name.toLowerCase().endsWith('.png');
        
        if (isValidImage) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result && messageBodyRef.current) {
              const img = document.createElement('img');
              img.src = event.target.result as string;
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.display = 'block';
              img.style.margin = '10px 0';
              img.style.borderRadius = '4px';
              
              messageBodyRef.current.focus();
              const selection = window.getSelection();
              
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // Insert image and a line break after it
                range.insertNode(img);
                const br = document.createElement('br');
                range.setStartAfter(img);
                range.insertNode(br);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                // Append to end of content
                messageBodyRef.current.appendChild(img);
                const br = document.createElement('br');
                messageBodyRef.current.appendChild(br);
                
                // Move cursor after the image
                const range = document.createRange();
                range.setStartAfter(br);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }
          };
          reader.readAsDataURL(file);
        } else {
          // Show error for unsupported file types
          try {
            Swal.fire({
              icon: 'warning',
              title: 'Unsupported File Type',
              text: `Only .jpg and .png image files are supported. "${file.name}" was not added.`,
              confirmButtonColor: '#8B7355'
            }).catch(() => {
              // Ignore errors if Swal is already closed or component unmounted
            });
          } catch (error) {
            // Ignore Swal errors
          }
        }
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!messageBodyRef.current) return;
    
    // Check each field individually for better error messages
    // recipientId can be a string or number
    const recipientId = composeData.recipientId ? String(composeData.recipientId).trim() : '';
    const subject = (composeData.subject || '').trim();
    // Get content from contentEditable div
    const bodyContent = messageBodyRef.current.innerHTML || '';
    const textContent = messageBodyRef.current.textContent || '';
    
    // Strip HTML tags to check if there's actual text content
    const textOnly = textContent.trim();
    
    if (!recipientId || recipientId === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: `Please select a recipient. (recipientId: ${composeData.recipientId || 'undefined'})`,
        confirmButtonColor: '#8B7355'
      });
      return;
    }
    
    if (!subject) {
      // Missing subject
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter a subject.',
        confirmButtonColor: '#8B7355'
      });
      return;
    }
    
    // Check if there's actual text content (not just empty HTML tags or whitespace)
    if (!textOnly) {
      // Missing body content
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter a message.',
        confirmButtonColor: '#8B7355'
      });
      return;
    }
    
    // Use innerHTML to preserve formatting, but ensure we have content
    const finalBody = bodyContent.trim() || textOnly;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: recipientId,
          subject: subject,
          body: finalBody
        })
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Message Sent',
          text: 'Your message has been sent successfully.',
          confirmButtonColor: '#8B7355'
        });
        setShowCompose(false);
        setComposeData({ recipientId: '', recipientName: '', subject: '', body: '' });
        setIsReply(false);
        setAttachedFiles([]);
        if (messageBodyRef.current) {
          messageBodyRef.current.innerHTML = '';
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        loadMessages();
        // Dispatch event to refresh unread counts for recipient
        window.dispatchEvent(new CustomEvent('refreshMessages'));
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error' };
        }
        // Error response
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.error || errorData.message || 'Failed to send message.',
          confirmButtonColor: '#8B7355'
        });
      }
    } catch (error: any) {
      // Error sending message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Failed to send message.',
        confirmButtonColor: '#8B7355'
      });
    }
  };

  const getFilteredMessages = () => {
    if (activeSubmenu === 'inbox') {
      return messages.filter(msg => msg.folder === 'inbox' && !msg.isDeleted);
    } else if (activeSubmenu === 'starred') {
      return messages.filter(msg => msg.isStarred && !msg.isDeleted);
    } else if (activeSubmenu === 'sent') {
      return messages.filter(msg => msg.folder === 'sent' && !msg.isDeleted);
    } else if (activeSubmenu === 'trash') {
      return messages.filter(msg => msg.isDeleted || msg.folder === 'trash');
    }
    return messages;
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
                        className={`${styles.notificationContent} ${!notification.is_read ? styles.notificationItemClickable : styles.notificationItemDefault}`}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
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
      
      case 'inbox':
      case 'starred':
      case 'sent':
      case 'trash':
        return (
          <div className={styles.dashboardSection}>
            <div className={styles.messagesHeader}>
              <h2 className={styles.sectionTitle}>
                {activeSubmenu === 'inbox' && 'Inbox'}
                {activeSubmenu === 'starred' && 'Starred'}
                {activeSubmenu === 'sent' && 'Sent'}
                {activeSubmenu === 'trash' && 'Trash'}
              </h2>
              <div className={styles.messagesToolbar}>
                {selectedMessageIds.length > 0 ? (
                  <button
                    onClick={handleBulkDelete}
                    className={styles.deleteBtn}
                  >
                    <FaTrash /> Delete ({selectedMessageIds.length})
                  </button>
                ) : (
                  <>
                    <button 
                      className={styles.secondaryBtn}
                      onClick={loadMessages}
                    >
                      Refresh
                    </button>
                    {activeSubmenu !== 'trash' && (
                      <button 
                        className={styles.secondaryBtn}
                        onClick={() => {
                          setComposeData({ recipientId: '', recipientName: '', subject: '', body: '' });
                          setIsReply(false);
                          setShowCompose(true);
                        }}
                      >
                        <FaPlus /> Compose
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {messagesLoading ? (
              <div className={styles.placeholderText}>Loading messages...</div>
            ) : getFilteredMessages().length === 0 ? (
              <div className={styles.placeholderText}>
                <p>
                  {activeSubmenu === 'inbox' && 'Your inbox is empty.'}
                  {activeSubmenu === 'starred' && 'You have no starred messages.'}
                  {activeSubmenu === 'sent' && 'You have no sent messages.'}
                  {activeSubmenu === 'trash' && 'Your trash is empty.'}
                </p>
              </div>
            ) : selectedMessage ? (
              <>
                <div 
                  className={styles.modalBackdrop}
                  onClick={() => setSelectedMessage(null)}
                />
                <div className={styles.messageViewModal}>
                <div className={styles.messageViewHeader}>
                  <h3>{selectedMessage.subject}</h3>
                  <div className={styles.headerActions}>
                    <button
                      className={`${styles.starIconBtn} ${selectedMessage.isStarred ? styles.starred : ''}`}
                      onClick={() => {
                        handleStar(selectedMessage.id, selectedMessage.isStarred);
                        setSelectedMessage({ ...selectedMessage, isStarred: !selectedMessage.isStarred });
                      }}
                      title={selectedMessage.isStarred ? 'Unstar' : 'Star'}
                    >
                      <FaStar />
                    </button>
                    <button 
                      className={styles.closeBtn}
                      onClick={() => setSelectedMessage(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className={styles.messageViewContent}>
                  <div className={styles.messageViewMeta}>
                    <div>
                      <strong>{activeSubmenu === 'sent' ? 'To:' : 'From:'}</strong> {activeSubmenu === 'sent' ? (selectedMessage.recipientName || 'Unknown') : selectedMessage.senderName}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(selectedMessage.timestamp).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                      })}
                    </div>
                  </div>
                  <div 
                    className={styles.messageViewBody}
                    dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
                  />
                </div>
                <div className={styles.messageViewActions}>
                  {activeSubmenu !== 'sent' && (
                    <button
                      className={styles.replyBtn}
                      onClick={() => {
                        // Ensure we have a valid senderId
                        if (!selectedMessage.senderId || selectedMessage.senderId === '') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Cannot reply: sender information is missing.',
                            confirmButtonColor: '#8B7355'
                          });
                          return;
                        }
                        
                        const recipientId = String(selectedMessage.senderId).trim();
                        
                        if (!recipientId || recipientId === '') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Cannot reply: recipient ID is missing.',
                            confirmButtonColor: '#8B7355'
                          });
                          return;
                        }
                        
                        const replySubject = selectedMessage.subject.startsWith('Re:') || selectedMessage.subject.startsWith('re:') 
                          ? selectedMessage.subject 
                          : `Re: ${selectedMessage.subject}`;
                        
                        setComposeData({
                          recipientId: recipientId,
                          recipientName: selectedMessage.senderName,
                          subject: replySubject,
                          body: ''
                        });
                        setIsReply(true);
                        setSelectedMessage(null);
                        setShowCompose(true);
                      }}
                    >
                      <FaReply /> <span>Reply</span>
                    </button>
                  )}
                  {activeSubmenu === 'trash' ? (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        handlePermanentDelete(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  ) : (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        handleDelete(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
              </>
            ) : (
              <>
                {activeSubmenu === 'trash' && (
                  <div className={styles.trashWarningNote}>
                    <strong>Note:</strong> Messages in trash will be automatically deleted after 30 days.
                  </div>
                )}
                {getFilteredMessages().length > 0 && (
                  <div className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedMessageIds.length === getFilteredMessages().length && getFilteredMessages().length > 0}
                      onChange={toggleSelectAllMessages}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>Select all</span>
                  </div>
                )}
                <div className={styles.messagesList}>
                  {getFilteredMessages().map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.messageItem} ${!message.isRead ? styles.unread : ''}`}
                      onClick={() => {
                        if (!selectedMessageIds.length) {
                          handleMessageClick(message);
                        }
                      }}
                    >
                      <div className={styles.messageIcons}>
                        <div className={styles.messageCheckbox}>
                          <input 
                            type="checkbox"
                            checked={selectedMessageIds.includes(message.id)}
                            onChange={() => toggleMessageSelection(message.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <button
                          className={`${styles.starBtn} ${message.isStarred ? styles.starred : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(message.id, message.isStarred);
                          }}
                          title={message.isStarred ? 'Unstar' : 'Star'}
                        >
                          <FaStar />
                        </button>
                      </div>
                      <div className={styles.messageContent}>
                        {message.folder === 'sent' ? (
                          <span className={styles.messageSender}>
                            To: {message.recipientName || 'Unknown'}
                          </span>
                        ) : (
                          <span className={styles.messageSender}>{message.senderName}</span>
                        )}
                        <span className={styles.messageSubjectPreview}>
                          <span className={styles.messageSubject}>{message.subject}</span>
                          <span className={styles.messagePreview}>
                            {' - '}
                            {message.body.replace(/<[^>]*>/g, '').substring(0, 50)}
                            {message.body.replace(/<[^>]*>/g, '').length > 50 ? '...' : ''}
                          </span>
                        </span>
                      </div>
                      <div className={styles.messageDate}>
                        {new Date(message.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Compose Window Modal */}
            {showCompose && (
              <>
                <div 
                  className={styles.composeBackdrop}
                  onClick={() => {
                    setShowCompose(false);
                    setComposeData({ recipientId: '', recipientName: '', subject: '', body: '' });
                    setIsReply(false);
                    setAttachedFiles([]);
                    if (messageBodyRef.current) {
                      messageBodyRef.current.innerHTML = '';
                    }
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    setClients([]); // Clear clients list when closing
                  }}
                />
                <div className={styles.composeWindow} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.composeWindowHeader}>
                    <h3 className={styles.composeWindowTitle}>
                      {isReply && composeData.recipientName ? `Reply to ${composeData.recipientName}` : 'New Message'}
                    </h3>
                    <div className={styles.windowControls}>
                      <button 
                        className={styles.windowControlBtn}
                        onClick={() => {
                          setShowCompose(false);
                          setComposeData({ recipientId: '', recipientName: '', subject: '', body: '' });
                          setIsReply(false);
                          setAttachedFiles([]);
                          if (messageBodyRef.current) {
                            messageBodyRef.current.innerHTML = '';
                          }
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        title="Close"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.composeWindowBody}>
                    <div className={styles.composeToRow}>
                      <span className={styles.composeLabel}>To</span>
                      {loadingClients ? (
                        <span className={styles.loadingText}>Loading clients...</span>
                      ) : (
                        <select
                          className={styles.composeSelect}
                          value={composeData.recipientId}
                          onChange={(e) => {
                            const selectedClient = clients.find(c => c.user_id === e.target.value);
                            setComposeData({
                              ...composeData,
                              recipientId: e.target.value,
                              recipientName: selectedClient ? `${selectedClient.first_name} ${selectedClient.last_name}` : ''
                            });
                            // If selecting a client in a new message (not reply), ensure isReply is false
                            if (!isReply) {
                              setIsReply(false);
                            }
                          }}
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.user_id} value={client.user_id}>
                              {client.first_name} {client.last_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className={styles.composeToRow}>
                      <span className={styles.composeLabel}>Subject</span>
                      <input 
                        type="text" 
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        className={styles.composeInput}
                        placeholder="Subject"
                      />
                    </div>
                    <div className={styles.composeMessageBody}>
                      <div
                        ref={messageBodyRef}
                        contentEditable
                        className={styles.composeEditable}
                        data-placeholder="Compose message"
                      />
                    </div>
                    <div className={styles.composeToolbar}>
                      <div className={styles.composeToolbarLeft}>
                        <button
                          className={styles.sendBtn}
                          onClick={handleSendMessage}
                        >
                          Send
                        </button>
                        <div className={styles.formattingButtons}>
                          <button
                            className={styles.formatBtn}
                            onClick={(e) => {
                              e.preventDefault();
                              formatText('bold');
                            }}
                            title="Bold"
                          >
                            <FaBold />
                          </button>
                          <button
                            className={styles.formatBtn}
                            onClick={(e) => {
                              e.preventDefault();
                              formatText('italic');
                            }}
                            title="Italic"
                          >
                            <FaItalic />
                          </button>
                          <button
                            className={styles.formatBtn}
                            onClick={(e) => {
                              e.preventDefault();
                              formatText('underline');
                            }}
                            title="Underline"
                          >
                            <FaUnderline />
                          </button>
                          <button
                            className={styles.formatBtn}
                            onClick={handleAttachClick}
                            title="Attach Image"
                            type="button"
                          >
                            <FaPaperclip />
                          </button>
                        </div>
                      </div>
                      <button 
                        className={styles.discardBtn}
                        onClick={() => {
                          setShowCompose(false);
                          setComposeData({ recipientId: '', recipientName: '', subject: '', body: '' });
                          setIsReply(false);
                          setAttachedFiles([]);
                          if (messageBodyRef.current) {
                            messageBodyRef.current.innerHTML = '';
                          }
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        title="Discard"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </>
            )}
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
