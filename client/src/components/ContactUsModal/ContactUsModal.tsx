import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Dialog from 'components/Dialog';
import * as s from './ContactUsModal.styled';
import Button from 'components/Button';
import { FieldValues, useForm } from 'react-hook-form';
import TextInput from 'components/form/TextInput';
import { useState } from 'react';
import ErrorMessage from 'components/form/ErrorMessage';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Box } from '@mui/system';
import { contactUs } from 'api/auth';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactUsModal = ({ onClose, isOpen }: ContactUsModalProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';
  const [ticketId, setTicketId] = useState('');

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = (data: FieldValues) => {
    const { name, email, desc } = data;

    try {
      const generatedTicketId = generateTicketId();
      setTicketId(generatedTicketId);

      contactUs(name, email, desc, ticketId);
    } catch (e: any) {
      setErrorMessage('An error occurred while sending your email!');
    }

    setShowSuccessMessage(true);
    reset();
  };

  const onCloseAndReset = () => {
    setShowSuccessMessage(false);
    reset();
    onClose();
  };

  const generateTicketId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 5;
    let ticketId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      ticketId += characters[randomIndex];
    }

    return ticketId;
  };

  return isOpen ? (
    <Dialog
      id={'contact-us'}
      title={'Contact Us'}
      onClose={onCloseAndReset}
      open={isOpen}
    >
      {showSuccessMessage ? (
        <Box sx={{ py: 6 }}>
          <Typography component="h6" variant="h6" sx={{ mb: 1 }}>
            Your message has been submitted.
          </Typography>
          <Typography component="p" variant="body2">
            For future reference, your message code is: {ticketId}
          </Typography>
        </Box>
      ) : (
        <>
          <TextInput
            colormode="dark"
            defaultValue={''}
            name="name"
            id="name"
            control={control}
            fullWidth
            variant="outlined"
            label={'Contact Name'}
            placeholder="Your name"
          />
          <TextInput
            colormode="dark"
            defaultValue={''}
            name="email"
            id="email"
            control={control}
            fullWidth
            variant="outlined"
            label={'Contact Email'}
            placeholder="Your email address"
          />
          <TextInput
            colormode="dark"
            defaultValue={''}
            name="message"
            id="message"
            control={control}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label={'Message'}
            placeholder="Your message"
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <Grid
            container
            flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <Grid xs={12} md="auto">
              <Box mt={2}>
                <HCaptcha
                  theme="dark"
                  sitekey={hCaptchaKey}
                  onVerify={onCaptchaSuccess}
                />
              </Box>
            </Grid>
            <Grid xs={12} md="auto">
              <Box mt={2}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!captchaVerified}
                  color="secondary"
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Dialog>
  ) : null;
};

export default ContactUsModal;
