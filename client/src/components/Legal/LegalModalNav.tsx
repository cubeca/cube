import { useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import * as s from './Legal.styled';
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

const LegalModalNav = () => {
  const { t } = useTranslation();
  const [legalDisplay, setLegalDisplay] = useState(false);

  return (
    <>
      <s.NavLink onClick={() => setLegalDisplay(true)}>
        {t(
          'Our Code of Contact is Defined by our Terms of Service and Privacy Policy'
        )}
      </s.NavLink>

      <BootstrapDialog
        onClose={() => setLegalDisplay(false)}
        aria-labelledby="customized-dialog-title"
        open={legalDisplay}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setLegalDisplay(false)}
        >
          Terms of Service and Privacy Policy
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <ToS />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLegalDisplay(false)}>Close</Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default LegalModalNav;
