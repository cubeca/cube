import * as React from 'react';
import { Stack, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { ReactComponent as CubeLogo } from 'assets/icons/cube.svg';
import NavPanel from './components/NavPanel';
import Social from './components/Social';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/form/TextInput';
import { ReactComponent as CreditsImg } from 'assets/icons/footer-credits.svg';
import * as s from './Footer.styled';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
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
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const Footer = () => {
  const { t } = useTranslation('about');

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    if (typeof localStorage.getItem('beta_message_seen') != "undefined") {
      const key = localStorage.getItem("beta_message_seen") || '',
        object = JSON.parse(key),
        dateString = object.timestamp,
        twentyfourhours = 86400000,
        now = new Date().getTime().toString();

      if (parseInt(now) - parseInt(dateString) > twentyfourhours) {
        setOpen(true);
      }
    }
  };
  const handleClose = () => {
    setOpen(false);
    const last_seen = {timestamp: new Date().getTime()}
    localStorage.setItem('beta_message_seen', JSON.stringify(last_seen));
  };
  
  React.useEffect(() => {
    handleOpen();
  }, []);

  return (
    <s.Footer
      component="footer"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p="60px 8.333333333333333%"
      sx={{ backgroundColor: '#2F4048' }}
    >
      <Box sx={{ width: '40%' }}>
        <Typography component="h4" variant="h4">
          {t('Sign Up For Updates')}
        </Typography>

        <Typography component="p" variant="body2">
          {t(
            'Our emails are few and far between with occasional content teasers and NFT releases.'
          )}
        </Typography>

        <CreditsImg />
      </Box>

      <Box py="2rem">
        <NavPanel></NavPanel>
      </Box>
      <Social />

      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            Beta Site
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <strong>This site is in beta and is not yet live.</strong> Feel free to look around, but be prepared for some bugs and unfinished features.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Got it!
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </s.Footer>


  );
};

export default Footer;
