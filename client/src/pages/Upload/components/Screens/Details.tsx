import { Box, TextField, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { useState } from 'react';

const Details = ({
  control,
  handleVTTFilesUpload,
  expiryValue,
  onExpriryValueChange,
  uploadType
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isVTTUploadReady, setIsVTTUploadReady] = useState(false);

  const handleVTTOnDrop = (files: File[]) => {
    handleVTTFilesUpload(files);
    setIsVTTUploadReady(true);
  };

  const showField = (field: string) => {
    const reqMap = {
      video: ['description', 'vtt', 'kidsContent', 'expiry'],
      audio: ['description', 'vtt', 'expiry'],
      pdf: ['description', 'expiry'],
      link: ['description', 'expiry']
    };
    if (!uploadType) return false;
    // @ts-ignore
    const map = reqMap[uploadType];
    return map.includes(field);
  };

  return (
    <Box className={'upload__details-screen'}>
      <Typography component="h2" variant="h2">
        {t('Details')}
      </Typography>
      {showField('description') ? (
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
      ) : null}
      {showField('vtt') ? (
        <Box my={theme.spacing(5)}>
          <UploadInput
            text={t('VTT File')}
            onDrop={handleVTTOnDrop}
            maxFiles={1}
            isUploadReady={isVTTUploadReady}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              "Upload VTT File For Subtitles. If you don't have one, don't worry. VTT will be automatically generated for you in the event on one is not provided. Please stick around to confirm their content."
            )}
            <br />
            <br />
            {t(
              'DVTT files ensure your content has subtitles.  Closed captions can include information about background sounds and speaker changes. Subtitles assume the viewer hears the audio and as a result does not contain background information. Please format the file to have this code at the top to ensure it adapts to various screen sizes.'
            )}
            <br />
            {t('Code')}: XXX
          </Typography>
        </Box>
      ) : null}
      {showField('kidsContent') ? (
        <Box my={theme.spacing(5)}>
          <Select
            label={t('Is this video made for kids? (required)')}
            name="audience"
            control={control}
            fullWidth={false}
            defaultValue=""
          >
            <MenuItem.li value="yeskids">
              {t('Yes, it’s made for kids')}
            </MenuItem.li>
            <MenuItem.li value="nokids">
              {t('No, it’s not made for kids')}
            </MenuItem.li>
          </Select>

          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'Regardless of your location, you’re legally required to comply with the Children’s Online Privacy Protection Act (COPPA) and/or other laws. You’re required to tell us whether your videos are made for kids. What’s content made for kids?'
            )}
          </Typography>
        </Box>
      ) : null}

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
