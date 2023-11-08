import { Box, Typography } from '@mui/material';
import * as s from './AgeCheckModal.styled';

interface AgeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgeCheckModal = ({ onClose, isOpen }: AgeCheckModalProps) => {
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
            gap: 2 // space between items
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
            <s.ModalButton variant="contained" onClick={onClose}>
              I&apos;m 18+
            </s.ModalButton>
            <s.ModalButton
              variant="outlined"
              onClick={() => {
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
