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

  return (
    <Dialog open={isOpen} onClose={onClose} id="edit-profile-dialog" title="">
      <EditProfileForm
        profile={profile}
        onSave={onClose}
        onUploadComplete={onUploadComplete}
      />
    </Dialog>
  );
};

export default EditDialog;
