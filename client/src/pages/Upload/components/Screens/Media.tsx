import { Box, Link, Typography, useTheme } from '@mui/material';
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

  const videoFileTypes = [
    'MP4',
    'MKV',
    'MOV',
    'AVI',
    'FLV',
    'MPEG-2 TS',
    'MPEG-2 PS',
    'MXF',
    'LXF',
    'GXF',
    '3GP',
    'WebM',
    'MPG',
    'QuickTime'
  ];

  const audioFileTypes = ['MP3', 'WAV', 'OGG', 'AAC'];
  const pdfFileTypes = ['PDF'];

  const showField = (field: string) => {
    const reqMap = {
      video: ['title', 'mediaFile', 'thumbNail', 'videoFileTypes'],
      audio: ['title', 'mediaFile', 'thumbNail', 'audioFileTypes'],
      pdf: ['title', 'thumbNail', 'mediaFile', 'pdfFileTypes'],
      link: ['title', 'thumbNail', 'link']
    };
    if (!uploadType) return false;
    // @ts-ignore
    const map = reqMap[uploadType];
    return map.includes(field);
  };

  const videoFileTypesText = showField('videoFileTypes')
    ? videoFileTypes.length > 1
      ? videoFileTypes.slice(0, -1).join(', ') +
        ', or ' +
        videoFileTypes[videoFileTypes.length - 1]
      : videoFileTypes.join('')
    : '';

  const audioFileTypesText = showField('audioFileTypes')
    ? audioFileTypes.length > 1
      ? audioFileTypes.slice(0, -1).join(', ') +
        ', or ' +
        audioFileTypes[audioFileTypes.length - 1]
      : audioFileTypes.join('')
    : '';

  const pdfFileTypesText = showField('pdfFileTypes')
    ? pdfFileTypes.length > 1
      ? pdfFileTypes.slice(0, -1).join(', ') +
        ', or ' +
        pdfFileTypes[pdfFileTypes.length - 1]
      : pdfFileTypes.join('')
    : '';

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
            'What type of media are you uploading? Don’t see the type you need in this list? '
          )}
          <Link
            href="mailto:ash@cubecommons.ca"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Contact us.')}
          </Link>
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
              `What is the title of this content? This is the name that people will see when they search for and view your content. Keep it short, your content will also be searchable by the description & tags you'll add in a minute.`
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
              `Upload your file. It should correspond with the file type you have selected above. This is a shared network, to reduce energy and space consumption please upload files of type: ${pdfFileTypesText}${videoFileTypesText}${audioFileTypesText} no more than 2GB. The arrow should change to a checkmark.`
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
              'Upload a Thumbnail image. For best results, we recommend dimensions are 720px by 720px. The file size should not exceed 500 KB.'
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
              'More is better! Alt text should describe who or what is in the picture, atmospheric details, any vibrant colours, objects or symbols.'
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
              'Upload a Banner Image to allow users to preview your link. For best results, we recommend images dimensions are 1280px by 720px. File size should not exceed 500 KB.'
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
