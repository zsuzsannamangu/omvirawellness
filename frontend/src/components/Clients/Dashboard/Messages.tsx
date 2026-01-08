'use client';

import { useState, useEffect, useRef } from 'react';
import { FaStar, FaTrash, FaPlus, FaEnvelope, FaEnvelopeOpen, FaPaperPlane, FaTrashRestore, FaBold, FaItalic, FaUnderline, FaPaperclip, FaReply } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Clients/Dashboard.module.scss';
import { API_URL } from '@/config/api';

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

interface Provider {
  id: string;
  business_name: string | null;
  contact_name: string | null;
}

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    toProviderId: '',
    subject: '',
    body: ''
  });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messageBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch providers when compose window opens
  useEffect(() => {
    const fetchProviders = async () => {
      if (showCompose && providers.length === 0) {
        setLoadingProviders(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/providers`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setProviders(data);
          }
        } catch (error) {
          // Error fetching providers
        } finally {
          setLoadingProviders(false);
        }
      }
    };

    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompose]);

  // Clear selection when switching folders
  useEffect(() => {
    setSelectedMessageIds([]);
  }, [activeSubmenu]);

  // Fetch messages from API
  const fetchMessages = async () => {
    setLoading(true);
    setSelectedMessageIds([]);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // No authentication token found
        setLoading(false);
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
        setMessages(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setMessages([]);
      }
    } catch (error) {
      // Error fetching messages
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubmenu]);

  // Cleanup effect for compose window
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (messageBodyRef.current) {
        messageBodyRef.current.innerHTML = '';
      }
    };
  }, []);

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
      console.error('Error updating star status:', error);
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
        fetchMessages();
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

  const handleRestore = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: false, folder: 'inbox' })
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Error restoring message:', error);
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
        fetchMessages();
        window.dispatchEvent(new CustomEvent('refreshMessages'));
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

  const toggleSelectAll = () => {
    if (selectedMessageIds.length === filteredMessages.length) {
      setSelectedMessageIds([]);
    } else {
      setSelectedMessageIds(filteredMessages.map(msg => msg.id));
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

  const handleSend = async () => {
    if (!messageBodyRef.current) return;
    
    if (!composeData.toProviderId) {
      Swal.fire({
        icon: 'warning',
        title: 'Provider Required',
        text: 'Please select a provider to send the message to.',
        confirmButtonColor: '#8B7355'
      });
      return;
    }

    if (!composeData.subject.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Subject Required',
        text: 'Please enter a subject for your message.',
        confirmButtonColor: '#8B7355'
      });
      return;
    }
    
    const bodyContent = messageBodyRef.current.innerHTML || '';
    if (!bodyContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Message Required',
        text: 'Please enter a message.',
        confirmButtonColor: '#8B7355'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: composeData.toProviderId,
          subject: composeData.subject,
          body: bodyContent
        })
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Message Sent',
          text: 'Your message has been sent successfully.',
          confirmButtonColor: '#8B7355'
        });

        // Refresh messages if we're on sent folder
        if (activeSubmenu === 'sent') {
          const folderResponse = await fetch(`${API_URL}/messages?folder=sent`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (folderResponse.ok) {
            const data = await folderResponse.json();
            setMessages(data);
          }
        }

        // Clean up before closing
        setShowCompose(false);
        setComposeData({ to: '', toProviderId: '', subject: '', body: '' });
        setAttachedFiles([]);
        if (messageBodyRef.current) {
          messageBodyRef.current.innerHTML = '';
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }));
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.error || 'Failed to send message. Please try again.',
          confirmButtonColor: '#8B7355'
        });
      }
    } catch (error) {
      // Error sending message
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send message. Please try again.',
        confirmButtonColor: '#8B7355'
      });
    }
  };

  const handleDiscard = async () => {
    const result = await Swal.fire({
      title: 'Discard Message?',
      text: 'Are you sure you want to discard this message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B7355',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, discard it',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      // Clean up before closing
      setTimeout(() => {
        setShowCompose(false);
        setComposeData({ to: '', toProviderId: '', subject: '', body: '' });
        setAttachedFiles([]);
        if (messageBodyRef.current) {
          messageBodyRef.current.innerHTML = '';
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 0);
    }
  };

  const getProviderDisplayName = (provider: Provider): string => {
    return provider.contact_name || provider.business_name || 'Unknown Provider';
  };

  const handleCloseCompose = () => {
    // Clean up before closing
    setTimeout(() => {
      setShowCompose(false);
      setComposeData({ to: '', toProviderId: '', subject: '', body: '' });
      setAttachedFiles([]);
      if (messageBodyRef.current) {
        messageBodyRef.current.innerHTML = '';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 0);
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
          Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: `The file "${file.name}" is too large. Please send files that are 10MB or less.`,
            confirmButtonColor: '#8B7355'
          });
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
          Swal.fire({
            icon: 'warning',
            title: 'Unsupported File Type',
            text: `Only .jpg and .png image files are supported. "${file.name}" was not added.`,
            confirmButtonColor: '#8B7355'
          });
        }
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
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

  const filteredMessages = getFilteredMessages();

  const renderContent = () => {
    return (
      <div className={styles.messagesContent}>
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
                <FaTrash /> <span>Delete ({selectedMessageIds.length})</span>
              </button>
            ) : (
              <>
                <button 
                  className={styles.secondaryBtn}
                  onClick={fetchMessages}
                >
                  Refresh
                </button>
                {activeSubmenu !== 'trash' && (
                  <button 
                    className={styles.secondaryBtn}
                    onClick={() => setShowCompose(true)}
                  >
                    <FaPlus /> <span>Compose</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {showCompose && (
          <>
            <div 
              className={styles.composeBackdrop}
              onClick={handleCloseCompose}
            />
            <div className={styles.composeWindow}>
              <div className={styles.composeWindowHeader}>
                <h3 className={styles.composeWindowTitle}>New Message</h3>
                <div className={styles.windowControls}>
                  <button 
                    className={styles.windowControlBtn}
                    onClick={handleCloseCompose}
                    title="Close"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className={styles.composeWindowBody}>
                <div className={styles.composeToRow}>
                  <span className={styles.composeLabel}>To</span>
                  {loadingProviders ? (
                    <span className={styles.loadingText}>Loading providers...</span>
                  ) : (
                    <select
                      className={styles.composeSelect}
                      value={composeData.toProviderId}
                      onChange={(e) => {
                        const selectedProvider = providers.find(p => p.id === e.target.value);
                        setComposeData({ 
                          ...composeData, 
                          toProviderId: e.target.value,
                          to: selectedProvider ? getProviderDisplayName(selectedProvider) : ''
                        });
                      }}
                    >
                      <option value="">Select a provider</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {getProviderDisplayName(provider)}
                        </option>
                      ))}
                    </select>
                      )}
                    </div>

                    <div className={styles.composeToRow}>
                  <span className={styles.composeLabel}>Subject</span>
                  <input 
                    type="text" 
                    className={styles.composeInput}
                    placeholder="Subject"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  />
                </div>

                <div className={styles.composeMessageBody}>
                  <div
                    ref={messageBodyRef}
                    contentEditable
                    className={styles.composeEditable}
                    data-placeholder="Compose message"
                    suppressContentEditableWarning={true}
                    onInput={(e) => {
                      if (e.currentTarget) {
                        setComposeData({ ...composeData, body: e.currentTarget.innerHTML });
                      }
                    }}
                    onBlur={(e) => {
                      // Prevent issues when losing focus
                      if (e.currentTarget && !e.currentTarget.textContent?.trim()) {
                        e.currentTarget.innerHTML = '';
                      }
                    }}
                  />
                </div>

                <div className={styles.composeToolbar}>
                  <div className={styles.composeToolbarLeft}>
                    <button 
                      className={styles.sendBtn}
                      onClick={handleSend}
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
                        title="Attach File"
                        type="button"
                      >
                        <FaPaperclip />
                      </button>
                    </div>
                  </div>
                  <button 
                    className={styles.discardBtn}
                    onClick={handleDiscard}
                    title="Discard"
                  >
                    <FaTrash />
                  </button>
                </div>

                {attachedFiles.length > 0 && (
                  <div className={styles.attachedFiles}>
                    {attachedFiles.map((file, index) => (
                      <div key={index} className={styles.attachedFile}>
                        <span className={styles.attachedFileName}>{file.name}</span>
                        <button
                          className={styles.removeFileBtn}
                          onClick={() => handleRemoveFile(index)}
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

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

        {loading ? (
          <div className={styles.placeholderText}>Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className={styles.emptyMessages}>
            {activeSubmenu === 'inbox' && <FaEnvelope className={styles.emptyIcon} />}
            {activeSubmenu === 'starred' && <FaStar className={styles.emptyIcon} />}
            {activeSubmenu === 'sent' && <FaPaperPlane className={styles.emptyIcon} />}
            {activeSubmenu === 'trash' && <FaTrash className={styles.emptyIcon} />}
            <h3>No messages</h3>
            <p>
              {activeSubmenu === 'inbox' && 'Your inbox is empty.'}
              {activeSubmenu === 'starred' && 'You have no starred messages.'}
              {activeSubmenu === 'sent' && 'You have no sent messages.'}
              {activeSubmenu === 'trash' && 'Your trash is empty.'}
            </p>
          </div>
        ) : (
          <>
            {activeSubmenu === 'trash' && (
              <div className={styles.trashWarningNote}>
                <strong>Note:</strong> Messages in trash will be automatically deleted after 30 days.
              </div>
            )}
            {filteredMessages.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className={`${styles.secondaryBtn} ${styles.selectAllButton}`}
              >
                <input
                  type="checkbox"
                  checked={selectedMessageIds.length === filteredMessages.length && filteredMessages.length > 0}
                  onChange={toggleSelectAll}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectAll();
                  }}
                  className={styles.messageCheckbox}
                />
                <span>Select all</span>
              </button>
            )}
            <div className={styles.messagesList}>
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.messageItem} ${!message.isRead ? styles.unread : ''}`}
                  onClick={async () => {
                    if (!selectedMessageIds.length) {
                      setSelectedMessage(message);
                      // Mark as read when opened
                      if (!message.isRead) {
                        try {
                          const token = localStorage.getItem('token');
                          await fetch(`${API_URL}/messages/${message.id}`, {
                            method: 'PATCH',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ isRead: true })
                          });
                          setMessages(messages.map(msg =>
                            msg.id === message.id ? { ...msg, isRead: true } : msg
                          ));
                          // Dispatch event to refresh unread count
                          window.dispatchEvent(new CustomEvent('refreshMessages'));
                        } catch (error) {
                          // Error marking message as read
                        }
                      }
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
                  {activeSubmenu === 'sent' ? (
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

        {selectedMessage && (
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
                <button
                  className={styles.replyBtn}
                  onClick={() => {
                    if (activeSubmenu === 'sent') {
                      // For sent messages, reply goes to the recipient
                      setComposeData({
                        to: selectedMessage.recipientName || 'Unknown',
                        toProviderId: selectedMessage.recipientId,
                        subject: selectedMessage.subject.startsWith('Re:') || selectedMessage.subject.startsWith('re:')
                          ? selectedMessage.subject
                          : `Re: ${selectedMessage.subject}`,
                        body: ''
                      });
                    } else {
                      // For inbox messages, reply goes to the sender
                      setComposeData({
                        to: selectedMessage.senderName,
                        toProviderId: selectedMessage.senderId,
                        subject: selectedMessage.subject.startsWith('Re:') || selectedMessage.subject.startsWith('re:')
                          ? selectedMessage.subject
                          : `Re: ${selectedMessage.subject}`,
                        body: ''
                      });
                    }
                    setSelectedMessage(null);
                    setShowCompose(true);
                  }}
                >
                  <FaReply /> <span>Reply</span>
                </button>
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
        )}
      </div>
    );
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
