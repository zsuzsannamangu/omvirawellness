import Swal from 'sweetalert2';

/**
 * Accessible confirmation dialog utility
 * Uses SweetAlert2 with ARIA support and keyboard navigation
 */

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export const confirmAction = async (options: ConfirmOptions): Promise<boolean> => {
  const {
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
  } = options;

  const iconMap = {
    warning: 'warning' as const,
    danger: 'error' as const,
    info: 'info' as const
  };

  const colorMap = {
    warning: '#f59e0b',
    danger: '#e74c3c',
    info: '#4a90e2'
  };

  const result = await Swal.fire({
    title,
    html: message,
    icon: iconMap[type],
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: colorMap[type],
    cancelButtonColor: '#6c757d',
    reverseButtons: true, // Cancel on left, Confirm on right (more intuitive)
    focusCancel: type === 'danger', // Focus cancel for destructive actions
    allowEscapeKey: true, // Allow Escape key
    allowEnterKey: true, // Allow Enter key
    customClass: {
      popup: 'accessible-confirm-popup',
      title: 'accessible-confirm-title',
      htmlContainer: 'accessible-confirm-message',
      confirmButton: 'accessible-confirm-button',
      cancelButton: 'accessible-cancel-button'
    },
    // Accessibility attributes
    ariaLabel: title,
  });

  return result.isConfirmed;
};

// Pre-configured confirmation types for common actions
export const confirmDelete = (itemName: string) =>
  confirmAction({
    title: 'Delete this item?',
    message: `Are you sure you want to delete <strong>${itemName}</strong>? This cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Keep it',
    type: 'danger'
  });

export const confirmLogout = () =>
  confirmAction({
    title: 'Log out?',
    message: 'Are you sure you want to log out?',
    confirmText: 'Log out',
    cancelText: 'Stay logged in',
    type: 'info'
  });

export const confirmCancelBooking = (providerName: string) =>
  confirmAction({
    title: 'Cancel this booking?',
    message: `Are you sure you want to cancel your session with <strong>${providerName}</strong>?`,
    confirmText: 'Cancel booking',
    cancelText: 'Keep booking',
    type: 'warning'
  });

export const confirmDeactivateAccount = () =>
  confirmAction({
    title: 'Deactivate your account?',
    message: 'Your profile will be hidden and you won\'t receive bookings. You can reactivate anytime.',
    confirmText: 'Deactivate',
    cancelText: 'Keep active',
    type: 'warning'
  });

export const confirmUnsavedChanges = () =>
  confirmAction({
    title: 'Unsaved changes',
    message: 'You have unsaved changes. Do you want to leave without saving?',
    confirmText: 'Leave',
    cancelText: 'Stay and save',
    type: 'warning'
  });



