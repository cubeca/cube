/**
 * `Dialog` renders a modal dialog using Material-UI's `Dialog` component.
 * It is designed to display dynamic content passed as children and includes a customizable title.
 * The dialog can be closed using a close icon button, which triggers the `onClose` callback.
 */

import { FC } from 'react';
import { Dialog as MuiDialog, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import * as s from './Dialog.styled';

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
    <s.Wrapper onClose={onClose} aria-labelledby={id} open={open}>
      <s.Title id={id}>
        <Typography component="h2" variant="h4">
          {title}
        </Typography>
        {onClose ? (
          <s.Close aria-label={t('close')} onClick={onClose}>
            <CloseIcon />
          </s.Close>
        ) : null}
      </s.Title>
      <s.Body>{children}</s.Body>
    </s.Wrapper>
  );
};

export default Dialog;
