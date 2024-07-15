/* AgeCheckModal Component
 *   This component renders a modal that prompts the user to confirm if they are over 18 years old.
 *   The modal appears full-screen when open and prevents click propagation to underlying elements.
 *   It contains two buttons: one for users over 18, and another for users under 18 which also navigates back in history and closes the modal.
 */

import { Box, Typography } from '@mui/material';
import * as s from './AgeCheckModal.styled';

interface AgeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOver18Click: () => void;
  onUnder18Click: () => void;
}

const AgeCheckModal = ({
  onClose,
  isOpen,
  onOver18Click,
  onUnder18Click
}: AgeCheckModalProps) => {
  return isOpen ? (
    <s.FullscreenModalContainer onClick={onClose}>
      <s.ModalPageContainer>
        <Box
          onClick={(event) => event.stopPropagation()}
          sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Typography variant="h6">
            The following content requires a viewer to be 18 or older.
          </Typography>
          <Box
            sx={{
              maxWidth: '500px',
              display: 'flex',
              justifyContent: 'space-evenly'
            }}
          >
            <s.ModalButton variant="contained" onClick={onOver18Click}>
              I&apos;m 18+
            </s.ModalButton>
            <s.ModalButton
              variant="outlined"
              onClick={() => {
                onUnder18Click();
                history.back();
                onClose();
              }}
            >
              I&apos;m under 18
            </s.ModalButton>
          </Box>
        </Box>
      </s.ModalPageContainer>
    </s.FullscreenModalContainer>
  ) : null;
};

export default AgeCheckModal;
