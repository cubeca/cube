import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  IconButton
} from '@mui/material';
import ToS from './ToS';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface LegalModalSignupProps {
  callback: () => void;
  setDisplay: (display: boolean) => void;
  display: boolean;
}

const LegalModalSignup = (props: LegalModalSignupProps) => {
  const { callback, setDisplay, display } = props;

  return (
    <>
      <BootstrapDialog
        onClose={() => setDisplay(false)}
        aria-labelledby="customized-dialog-title"
        open={display}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setDisplay(false)}
        >
          Terms of Service
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <ToS />
          <Button onClick={() => callback()}>
            Accept Terms and Conditions
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisplay(false)}>Decline</Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default LegalModalSignup;
