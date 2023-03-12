import { Box, MenuItem, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { ContentTypes } from 'types/enums';

const Media = ({ control, handleMediaUpload, handleCoverImageUpload }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box className={'upload__media-screen'}>
      <Typography component="h2" variant="h2">
        {t('Media')}
      </Typography>

      <Box my={theme.spacing(5)}>
        <Select
          label={t('Media Type')}
          name="type"
          control={control}
          fullWidth={false}
          defaultValue=""
        >
          <MenuItem value={ContentTypes.Video}>{t('Video')}</MenuItem>
          <MenuItem value={ContentTypes.Audio}>{t('Audio')}</MenuItem>
          <MenuItem value={ContentTypes.PDF}>{t('PDF')}</MenuItem>
        </Select>
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'What type of media are you uploading? Don’t see the type you need in this list? Contact us.'
          )}
        </Typography>
      </Box>

      <Box my={theme.spacing(5)}>
        <TextInput
          control={control}
          name="title"
          fullWidth
          placeholder={t('Title (required)')}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'What is the title of this work? This is the name that people will see when they search for and view your content. Keep this short, you will be able to provide a longer description on the next screen.'
          )}
        </Typography>
      </Box>

      <Box my={theme.spacing(5)}>
        <UploadInput
          text={t('Media file (required)')}
          onDrop={handleMediaUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Upload your video. This is a shared network, to reduce energy and space consumption please upload files xxx, xxx or xxx, no more than xx mb. While your video uploads you can continue filling out the rest of this form. You will be able to submit your entry once the upload has finished.'
          )}
        </Typography>
      </Box>

      <Box my={theme.spacing(5)}>
        <UploadInput
          text={t('Thumbnail image (required)')}
          onDrop={handleCoverImageUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Upload a Thumbnail Image. Recommended image dimensions are xxx by xxx. File size should not exceed xxx kb.'
          )}
        </Typography>
      </Box>

      <Box my={theme.spacing(5)}>
        <TextInput
          control={control}
          name="imageText"
          placeholder={t('Thumbnail Image alt text (required)')}
          fullWidth
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Alt text should describe who or what is in the picture, atmospheric or prop details and any vibrant colours or important design elements or symbols'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Media;
