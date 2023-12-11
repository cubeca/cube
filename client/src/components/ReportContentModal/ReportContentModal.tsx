import { Stack, TextField, Typography } from '@mui/material';
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

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

const ReportContentModal = ({
  onClose,
  isOpen,
  onSubmitted
}: ReportContentModalProps) => {
  const { control, handleSubmit, reset } = useForm();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data: FieldValues) => {
    const { reportReason, contactName, contactEmail, reportDesc } = data;

    try {
      reportContent(
        location.pathname,
        reportReason,
        contactName,
        contactEmail,
        reportDesc
      );
    } catch (e: any) {
      setErrorMessage('An error occurred while submitting report!');
    }
    onSubmitted();
    reset();
  };

  const onCloseAndReset = () => {
    reset();
    onClose();
  };

  return isOpen ? (
    <Dialog
      id={'report-content'}
      title={'Report Content'}
      onClose={onCloseAndReset}
      open={isOpen}
    >
      <Typography component="h6" variant="h6">
        Select the reason you wish to report content
      </Typography>

      <sRadioInput.DarkRadioInput
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
        colorMode="dark"
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
        colorMode="dark"
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
        colorMode="dark"
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
      <Stack direction="row" justifyContent="right">
        <s.ModalButton onClick={handleSubmit(onSubmit)} color="secondary">
          Submit
        </s.ModalButton>
      </Stack>
    </Dialog>
  ) : null;
};

export default ReportContentModal;
