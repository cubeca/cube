import { FC } from 'react';
import {
  Box,
  Dialog as MuiDialog,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export interface DialogProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  open: boolean;
}

const Dialog: FC<DialogProps> = ({ open, onClose, children, id, title }) => {
  const { t } = useTranslation();
  return (
    <MuiDialog onClose={onClose} aria-labelledby={id} open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id={id}>
        <Typography component="h2" variant="h4">
          {title}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label={t('close')}
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
      <Box p="2rem" minWidth="540px">
        {children}
      </Box>
    </MuiDialog>
  );
};

export default Dialog;
