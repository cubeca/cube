import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import * as s from './LegalModal.styled';
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

const OpenSwitch = (
  type: string,
  setLegalDisplay: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { t } = useTranslation();
  switch (type) {
    case 'navlink':
      return (
        <s.NavLink onClick={() => setLegalDisplay(true)}>
          {t('Terms of Service')}
        </s.NavLink>
      );
    case 'openText':
      return (
        <s.Text onClick={() => setLegalDisplay(true)}>
          {t('Open Terms of Service')}
        </s.Text>
      );
    default:
      break;
  }
};

interface LegalModalProps {
  type: string;
}

const LegalModal = (props: LegalModalProps) => {
  const { type } = props;
  const [legalDisplay, setLegalDisplay] = useState(false);

  return (
    <>
      {OpenSwitch(type, setLegalDisplay)}
      <div>
        <BootstrapDialog
          onClose={() => setLegalDisplay(false)}
          aria-labelledby="customized-dialog-title"
          open={legalDisplay}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() => setLegalDisplay(false)}
          >
            Terms of Service
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ToS />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLegalDisplay(false)}>Close</Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </>
  );
};

export default LegalModal;
