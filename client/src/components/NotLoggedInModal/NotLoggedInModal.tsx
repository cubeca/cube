import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Dialog from 'components/Dialog';
import Button from 'components/Button';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/system';

interface NotLoggedInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotLoggedInModal = ({ onClose, isOpen }: NotLoggedInModalProps) => {
  const onCloseAndReset = () => {
    onClose();
  };

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseAndReset();
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const dialogElement = document.getElementById('not-logged-in-modal');
      dialogElement?.focus();
      document.addEventListener('keydown', handleKeyDown);
    } else {
      previousFocusRef.current?.focus();
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCloseAndReset]);

  const navigateToLogin = () => {
    onClose();
    window.location.href = '/login';
  };

  return isOpen ? (
    <Dialog
      id={'not-logged-in-modal'}
      title={'Not Logged In'}
      onClose={onCloseAndReset}
      open={isOpen}
      aria-modal="true"
      aria-labelledby="not-logged-in-modal"
      ref={previousFocusRef}
    >
      <>
        <Grid
          container
          flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
          justifyContent="space-between"
        >
          <Typography variant="body1">
            To add content to a playlist you need to sign-in to either your User
            or Creator account. Both account types allow you to create and share
            playlists.
          </Typography>
          <Grid xs={12} md="auto">
            <Box mt={2}>
              <Button
                onClick={onClose}
                color="secondary"
                style={{ marginRight: '10px' }}
              >
                Cancel
              </Button>
              <Button onClick={navigateToLogin} color="secondary">
                Go to Login
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    </Dialog>
  ) : null;
};

export default NotLoggedInModal;
