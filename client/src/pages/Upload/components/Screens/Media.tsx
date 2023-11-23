import { Box, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { ContentTypes } from 'types/enums';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { useState } from 'react';

const Media = ({
  control,
  handleMediaUpload,
  handleCoverImageUpload,
  handleBannerImageUpload,
  uploadType
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isMediaUploadReady, setIsMediaUploadReady] = useState(false);
  const [isThumbUploadReady, setIsThumbUploadReady] = useState(false);
  const [isBannerUploadReady, setIsBannerUploadReady] = useState(false);

  const handleMediaOnDrop = (files: File[]) => {
    handleMediaUpload(files);
    setIsMediaUploadReady(true);
  };

  const handleThumbnailOnDrop = (files: File[]) => {
    handleCoverImageUpload(files);
    setIsThumbUploadReady(true);
  };

  const handleBannerOnDrop = (files: File[]) => {
    handleBannerImageUpload(files);
    setIsBannerUploadReady(true);
  };

  // const [isDragOver, setIsDragOver] = useState(false);
  // const handleDragOver = (e: any) => {
  //   e.preventDefault();
  //   setIsDragOver(true);
  // };
  // const handleDragLeave = () => {
  //   setIsDragOver(false);
  // };

  const showField = (field: string) => {
    const reqMap = {
      video: ['title', 'mediaFile', 'thumbNail'],
      audio: ['title', 'mediaFile', 'thumbNail'],
      pdf: ['title', 'thumbNail', 'mediaFile'],
      link: ['title', 'thumbNail', 'link']
    };
    if (!uploadType) return false;
    // @ts-ignore
    const map = reqMap[uploadType];
    return map.includes(field);
  };

  return (
    <Box className={'upload__media-screen'}>
      <Typography component="h2" variant="h2">
        {t('Media')}
      </Typography>

      <Box my={theme.spacing(5)}>
        <Select
          label={t('File Type')}
          name="type"
          control={control}
          fullWidth={false}
          defaultValue=""
        >
          <MenuItem.li value={ContentTypes.Video}>{t('Video')}</MenuItem.li>
          <MenuItem.li value={ContentTypes.Audio}>{t('Audio')}</MenuItem.li>
          <MenuItem.li value={ContentTypes.PDF}>{t('PDF')}</MenuItem.li>
          <MenuItem.li value={ContentTypes.Link}>{t('Link')}</MenuItem.li>
        </Select>
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'What type of media are you uploading? Don’t see the type you need in this list? Contact us.'
          )}
        </Typography>
      </Box>
      {showField('title') ? (
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
      ) : null}
      {showField('mediaFile') ? (
        <Box my={theme.spacing(5)}>
          <UploadInput
            text={t('Media file (required)')}
            onDrop={handleMediaOnDrop}
            maxFiles={1}
            isUploadReady={isMediaUploadReady}
            // onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            //style={`background-color: ${isDragOver ? 'red' : 'white'}`}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'Upload your audio, video or pdf content. This is a shared network, to reduce energy and space consumption please upload files xxx, xxx or xxx, no more than xx mb. While your video uploads you can click "Next" to complete required information for accessibility.'
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('thumbNail') ? (
        <Box my={theme.spacing(5)}>
          <UploadInput
            text={t('Thumbnail image (required)')}
            onDrop={handleThumbnailOnDrop}
            maxFiles={1}
            isUploadReady={isThumbUploadReady}
            // onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            // style={{ backgroundColor: isDragOver ? 'red' : 'white' }}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'Upload a Thumbnail Image. For best results, we recommend images dimensions are 720px by 720px. File size should not exceed 500 kb.'
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('thumbNail') ? (
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
      ) : null}
      {showField('link') ? (
        <Box my={theme.spacing(5)}>
          <UploadInput
            text={t('Banner image (required)')}
            onDrop={handleBannerOnDrop}
            maxFiles={1}
            isUploadReady={isBannerUploadReady}
            // onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            // style={{ backgroundColor: isDragOver ? 'red' : 'white' }}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'Upload a Banner Image to allow users to preview your link. For best results, we recommend images dimensions are 1280px by 720px. File size should not exceed 500 kb.'
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('link') ? (
        <Box my={theme.spacing(5)}>
          <TextInput
            control={control}
            name="bannerImageText"
            placeholder={t('Banner Image alt text (required)')}
            fullWidth
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'Alt text should describe who or what is in the picture, atmospheric or prop details and any vibrant colours or important design elements or symbols'
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('link') ? (
        <Box my={theme.spacing(5)}>
          <TextInput
            control={control}
            name="link"
            placeholder={t('Link to content (required)')}
            fullWidth
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'The link provided should be accessible without authentication from the internet.'
            )}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default Media;
