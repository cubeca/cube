import { Box, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Details = ({
  control,
  handleVTTFilesUpload,
  expiryValue,
  onExpriryValueChange
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box className={'upload__details-screen'}>
      <Typography component="h2" variant="h2">
        {t('Details')}
      </Typography>

      <Box my={theme.spacing(5)}>
        <TextInput
          control={control}
          name="description"
          placeholder={t('Description (required)')}
          multiline
          rows={8}
          fullWidth
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            `Though this text will be accessible to screen reading tools, it's important to remember that different accessibilities are assisted by different kinds of description. Use language in your text that considers a broad audience and is no greater than 280 characters.`
          )}
        </Typography>
      </Box>

      {/* <Box my={theme.spacing(5)}>
        <UploadInput
          text={t('Audio description (required)')}
          onDrop={handleVTTFilesUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t('Upload an audio file describing the information above')}
        </Typography>
      </Box> */}
      {/* // @ashlee we are not currently including audio description upload because we hope to auto generate it. But not sure why we were using the VTTFilesUpload  */}

      <Box my={theme.spacing(5)}>
        <UploadInput
          text={t('VTT file (required)')}
          onDrop={handleVTTFilesUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Upload VTT File For Subtitles. VTT files ensure your content has subtitles. Closed captions include information about background sounds and speaker changes. Subtitles assume the viewer hears the audio and as a result does not contain background information. Please format the file to have this code at the top to ensure it adapts to various screen sizes'
          )}
          <br />
          {t('Code')}: XXX
        </Typography>
      </Box>

      <Box my={theme.spacing(5)}>
        <Select
          label={t('Is this video made for kids? (required)')}
          name="audience"
          control={control}
          fullWidth={false}
          defaultValue=""
        >
          <MenuItem value="yeskids">{t('Yes, it’s made for kids')}</MenuItem>
          <MenuItem value="nokids">{t('No, it’s not made for kids')}</MenuItem>
        </Select>

        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Regardless of your location, you’re legally required to comply with the Children’s Online Privacy Protection Act (COPPA) and/or other laws. You’re required to tell us whether your videos are made for kids. What’s content made for kids?'
          )}
        </Typography>
      </Box>

      <Box my={theme.spacing(5)}>
        <DatePicker
          label={t('Expiry Date')}
          value={expiryValue}
          onChange={(newValue) => {
            onExpriryValueChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              // control={control}
              // name="expiry"
              fullWidth
              {...params}
            />
          )}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'You can include an expiration date for content that is only licensed for a period.'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Details;
