import { Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Dialog from 'components/Dialog';
import * as s from './ReportContentModal.styled';
import Button from 'components/Button';
import CheckboxInput from 'components/form/CheckboxInput';
import { FieldValues, useForm } from 'react-hook-form';
import TextInput from 'components/form/TextInput';
import * as sRadioInput from 'components/form/RadioInput/RadioInput.styled';
import { reportContent } from 'api/content';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ErrorMessage from 'components/form/ErrorMessage';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Box } from '@mui/system';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportContentModal = ({ onClose, isOpen }: ReportContentModalProps) => {
  const { control, handleSubmit, reset } = useForm();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';
  const [ticketId, setTicketId] = useState('');

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = (data: FieldValues) => {
    const { reportReason, contactName, contactEmail, reportDesc } = data;

    try {
      const generatedTicketId = generateTicketId();
      setTicketId(generatedTicketId);

      reportContent(
        location.pathname,
        reportReason,
        contactName,
        contactEmail,
        reportDesc,
        ticketId
      );
    } catch (e: any) {
      setErrorMessage('An error occurred while submitting report!');
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
      id={'report-content'}
      title={'Report Content'}
      onClose={onCloseAndReset}
      open={isOpen}
    >
      {showSuccessMessage ? (
        <Box sx={{ py: 6 }}>
          <Typography component="h6" variant="h6" sx={{ mb: 1 }}>
            Your report has been submitted.
          </Typography>
          <Typography component="p" variant="body2">
            Thank you for helping us maintain a safe environment. If you need to
            contact us, please reference this code: {ticketId}.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography component="h6" variant="h6">
            Select the reason you wish to report content
          </Typography>
          <sRadioInput.WrappingDarkRadioInput
            control={control}
            name="reportReason"
            id="reportReason"
            direction="vertical"
            defaultValue={'Policy'}
            options={[
              {
                value: 'Policy',
                label:
                  'Policy (non-legal), relating to CubeCommons content and product policies such as spam or phishing.',
                id: '1'
              },
              {
                value: 'Legal',
                label:
                  'Legal, relating to country/region-specific laws, such as privacy or intellectual property laws.',
                id: '2'
              }
            ]}
          />
          <TextInput
            colormode="dark"
            defaultValue={''}
            name="contactName"
            id="contactName"
            control={control}
            fullWidth
            variant="outlined"
            label={'Contact Name'}
            placeholder="Your name"
          />
          <TextInput
            colormode="dark"
            defaultValue={''}
            name="contactEmail"
            id="contactEmail"
            control={control}
            fullWidth
            variant="outlined"
            label={'Contact Email'}
            placeholder="Your email address"
          />
          <TextInput
            colormode="dark"
            defaultValue={''}
            name="reportDesc"
            id="reportDesc"
            control={control}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label={'Description'}
            placeholder="Describe the issue"
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

export default ReportContentModal;
