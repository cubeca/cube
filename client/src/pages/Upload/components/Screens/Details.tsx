import { Box, TextField, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

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
      pdf: ['description', 'expiry', 'kidsContent'],
      link: ['description', 'expiry', 'kidsContent']
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
            text={t('Subtitle File')}
            onDrop={handleVTTOnDrop}
            maxFiles={1}
            isUploadReady={isVTTUploadReady}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              "Upload File For Subtitles. If you don't have one, don't worry. Subtitle will be automatically generated for you in the event on one is not provided. Please stick around to confirm their content."
            )}
            <br />
          </Typography>
        </Box>
      ) : null}
      {showField('kidsContent') ? (
        <Box my={theme.spacing(5)}>
          <Controller
            name="audience"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                label={t('Is this video made for kids? (required)')}
                fullWidth={false}
                control={control}
                {...field}
              >
                <MenuItem.li value="yeskids">
                  {t(
                    'All Ages - This content is suitable for people under the age of 18.'
                  )}
                </MenuItem.li>
                <MenuItem.li value="nokids">
                  {t(
                    'Mature - This content is not suitable for people under the age of 18.'
                  )}
                </MenuItem.li>
              </Select>
            )}
          />

          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'You’re required to tell us whether your videos are made for kids. You may not upload content that is considered “obscene” or “pornography”. These terms are difficult to define, by law they are judged on the standard of what an average Canadian would think. If you have any doubt please mark your content "Mature".  Thank you.'
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
