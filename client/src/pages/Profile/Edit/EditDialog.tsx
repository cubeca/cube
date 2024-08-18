/**
 * `EditDialog` renders a modal dialog using the `Dialog` component and containing the EditProfileForm component.
 */
import React, { useEffect, useRef } from 'react';
import Dialog from 'components/Dialog';
import { useTranslation } from 'react-i18next';
import EditProfileForm from './EditProfileForm';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUploadComplete: () => void;
}

const EditDialog = ({
  isOpen,
  onClose,
  profile,
  onUploadComplete
}: EditDialogProps) => {
  const { t } = useTranslation();
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const dialogElement = document.getElementById('edit-profile-dialog');
      dialogElement?.focus();
      document.addEventListener('keydown', handleKeyDown);
    } else {
      previousFocusRef.current?.focus();
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      id="edit-profile-dialog"
      title=""
      aria-labelledby="edit-profile-dialog-title"
      aria-describedby="edit-profile-dialog-description"
      ref={previousFocusRef}
    >
      <h2 id="edit-profile-dialog-title">{t('Edit Profile')}</h2>
      <EditProfileForm
        profile={profile}
        onSave={onClose}
        onUploadComplete={onUploadComplete}
      />
    </Dialog>
  );
};

export default EditDialog;
