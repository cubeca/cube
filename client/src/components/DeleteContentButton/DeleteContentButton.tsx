import React, { FC } from 'react';
import useDeleteContent from '../../hooks/useDeleteContent';
import { DeleteButton } from 'components/Button/Button.styled';
import { useNavigate } from 'react-router-dom';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete-trashcan.svg';
import { getProfileTag } from 'utils/auth';
interface DeleteButtonProps {
  contentId?: string;
  currentUserId?: string;
}

const Button = ({ contentId, currentUserId }: DeleteButtonProps) => {
  const { deleteContent, isLoading, isError } = useDeleteContent();
  const navigate = useNavigate();
  const profileTag = getProfileTag();

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await deleteContent(contentId || '');
      navigate(`/profile/${profileTag}`);
    }
  };

  return (
    <div>
      <DeleteButton
        variant={'outlined'}
        onClick={handleDeleteClick}
        disabled={isLoading}
        color="error"
        startIcon={<DeleteIcon />}
      >
        Delete
      </DeleteButton>
      {isError && <div>Error deleting content</div>}
    </div>
  );
};

export default Button;
