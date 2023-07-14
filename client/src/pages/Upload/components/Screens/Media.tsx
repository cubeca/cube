import { Box, MenuItem, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { ContentTypes } from 'types/enums';
import {useState} from 'react';

const Media = ({ control, handleMediaUpload, handleCoverImageUpload }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
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
            'What is the title of this content? This is the name that people will see when they search for and view your content. Keep it short, your content will also be searchable by tags you add in minute'
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
            'Upload your audio, video or pdf content. This is a shared network, to reduce energy and space consumption please upload files xxx, xxx or xxx, no more than xx mb. While your video uploads you can click "Next" to complete required information for accessibility.'
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
            'Upload a Thumbnail Image. For best results, we recommend images dimensions are 720px by 720px. File size should not exceed 500 kb.'
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
