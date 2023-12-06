import * as React from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import NavPanel from './components/NavPanel';
import { ReactComponent as CreditsImg } from 'assets/icons/footer-credits.svg';
import * as s from './Footer.styled';

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

const Footer = () => {
  const [open, setOpen] = React.useState(false);
  const SHOW_BANNER = process.env.REACT_APP_SHOW_BANNER === 'true';

  const handleOpen = () => {
    // Only proceed if SHOW_BANNER is true
    if (SHOW_BANNER) {
      // Check if the 'beta_msg_seen' flag exists in localStorage
      const betaMsgSeen = localStorage.getItem('beta_msg_seen');

      // If the flag doesn't exist, open the message and exit the function
      if (betaMsgSeen === null) {
        setOpen(true);
        return;
      }

      // Parse the stored value to get the timestamp
      const storedData = JSON.parse(betaMsgSeen);
      const lastSeenTimestamp = storedData.timestamp;

      // Define time constants for comparison
      const twentyFourHoursInMilliseconds = 86400000;
      const currentTime = new Date().getTime();

      // Check if more than 24 hours have passed since the last view
      if (
        currentTime - parseInt(lastSeenTimestamp) >
        twentyFourHoursInMilliseconds
      ) {
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    const last_seen = { timestamp: new Date().getTime() };
    localStorage.setItem('beta_msg_seen', JSON.stringify(last_seen));
  };

  React.useEffect(() => {
    handleOpen();
  }, []);

  return (
    <s.Footer component="footer">
      <Grid container>
        {/* <Grid xs={10} xsOffset={1} md={4}>
          <Subscribe></Subscribe>
        </Grid>
         */}

        <Grid xs={10} xsOffset={1} md={5}>
          <NavPanel></NavPanel>
        </Grid>
      </Grid>

      <Grid container>
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
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Beta Site
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <strong>
                This site is a development site for{' '}
                <a
                  href="https://cubecommons.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-link"
                >
                  CubeCommons
                </a>
                {'. '}
              </strong>{' '}
              Feel free to look around, but be prepared for some bugs and
              unfinished features.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Got it!</Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </s.Footer>
  );
};

export default Footer;
