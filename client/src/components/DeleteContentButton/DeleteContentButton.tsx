/**
 * `DeleteContentButton` renders a styled delete button.
 * This button, when clicked, prompts the user for confirmation to delete a specific piece of content identified by `contentId`.
 * Upon confirmation, it utilizes the `useDeleteContent` hook to perform the deletion operation. After successfully deleting the content,
 * it navigates the user to their profile page, identified by a `profileTag` derived from the user's authentication details.
 *
 * @param {string} [contentId] The unique identifier of the content to be deleted.
 */

import useDeleteContent from '../../hooks/useDeleteContent';
import { DeleteButton } from 'components/Button/Button.styled';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete-trashcan.svg';
import { getProfileTag } from 'utils/auth';
interface DeleteButtonProps {
  contentId?: string;
}

const Button = ({ contentId }: DeleteButtonProps) => {
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
