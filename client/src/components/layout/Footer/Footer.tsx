import * as React from 'react';
import { Stack, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,  } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { ReactComponent as CubeLogo } from 'assets/icons/cube.svg';
import NavPanel from './components/NavPanel';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/form/TextInput';
import { ReactComponent as CreditsImg } from 'assets/icons/footer-credits.svg';
import Subscribe from './components/Subscribe/Subscribe';
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
    if (localStorage.getItem("beta_msg_seen") === null) {
      setOpen(true);
      return;
    }
    
    const key = localStorage.getItem("beta_msg_seen") || '',
      object = JSON.parse(key),
      dateString = object.timestamp,
      twentyfourhours = 86400000,
      now = new Date().getTime().toString();

    if (parseInt(now) - parseInt(dateString) > twentyfourhours) {
      setOpen(true);
    }
    
  };
  const handleClose = () => {
    setOpen(false);
    const last_seen = {timestamp: new Date().getTime()}
    localStorage.setItem('beta_msg_seen', JSON.stringify(last_seen));
  };
  
  React.useEffect(() => {
    handleOpen();
  }, []);

  return (
    <s.Footer component="footer">

      <Grid container>

        <Grid xs={10} xsOffset={1} md={4}>
          <Subscribe></Subscribe>
        </Grid>
        
        <Grid xs={10} xsOffset={1} md={5}>
          <NavPanel></NavPanel>
        </Grid>

        <Grid xs={10} xsOffset={1} md={4}>
          <s.Credits>
            <CreditsImg />
          </s.Credits>
        </Grid>
      </Grid>


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
