import { Box, Link, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { ContentTypes } from 'types/enums';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { useEffect, useState } from 'react';
import { handleFileChange } from 'utils/fileValidation';
import * as s from './Media.styled';
const Media = ({
  control,
  handleMediaUpload,
  handleCoverImageUpload,
  handleBannerImageUpload,
  uploadType,
  setIsMediaProperFileType,
  setIsCoverImageProperFileType,
  setIsBannerImageProperFileType,
  editMode,
  content
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isMediaUploadReady, setIsMediaUploadReady] = useState(false);
  const [isThumbUploadReady, setIsThumbUploadReady] = useState(false);
  const [isBannerUploadReady, setIsBannerUploadReady] = useState(false);
  const [mediaTypeError, setMediaTypeError] = useState('');
  const [mediaTypeAccepted, setMediaTypeAccepted] = useState(false);
  const [imageTypeAccepted, setImageTypeAccepted] = useState(false);
  const [bannerImageTypeAccepted, setBannerImageTypeAccepted] = useState(false);
  const [imageTypeError, setImageTypeError] = useState('');
  const [bannerImageTypeError, setBannerImageTypeError] = useState('');
  const [newImage, setNewImage] = useState<any>();
  const [newBannerImage, setNewBannerImage] = useState<any>();

  useEffect(() => {
    setMediaTypeError('');
    setMediaTypeAccepted(false);
    setImageTypeError('');
    setImageTypeAccepted(false);
    setBannerImageTypeError('');
    setBannerImageTypeAccepted(false);
  }, [uploadType]);

  useEffect(() => {
    if (mediaTypeAccepted) {
      setIsMediaUploadReady(true);
      setIsMediaProperFileType(true);
    } else {
      setIsMediaUploadReady(false);
      setIsMediaProperFileType(false);
    }
  }, [mediaTypeAccepted]);

  useEffect(() => {
    if (imageTypeAccepted) {
      setIsThumbUploadReady(true);
      setIsCoverImageProperFileType(true);
    } else {
      setIsThumbUploadReady(false);
      setIsCoverImageProperFileType(false);
    }
  }, [imageTypeAccepted]);

  useEffect(() => {
    if (bannerImageTypeAccepted) {
      setIsBannerUploadReady(true);
      setIsBannerImageProperFileType(true);
    } else {
      setIsBannerUploadReady(false);
      setIsBannerImageProperFileType(false);
    }
  }, [bannerImageTypeAccepted]);

  const handleMediaOnDrop = (files: File[]) => {
    handleFileChange(
      files[0],
      uploadType,
      setMediaTypeError,
      setMediaTypeAccepted
    );
    handleMediaUpload(files);
  };

  const handleThumbnailOnDrop = (files: File[]) => {
    handleFileChange(
      files[0],
      'image',
      setImageTypeError,
      setImageTypeAccepted
    );
    // get preview of new image
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    handleCoverImageUpload(files);
  };

  const handleBannerOnDrop = (files: File[]) => {
    handleFileChange(
      files[0],
      'image',
      setBannerImageTypeError,
      setBannerImageTypeAccepted
    );
    // get preview of new image
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBannerImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    handleBannerImageUpload(files);
  };

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
  const imageFileTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];
  const documentFileTypes = ['DOC', 'DOCX', 'ODT', 'RTF', 'TXT', 'XLS', 'XLSX'];
  const showField = (field: string) => {
    const reqMap = {
      video: ['title', 'mediaFile', 'thumbNail', 'videoFileTypes'],
      audio: ['title', 'mediaFile', 'thumbNail', 'audioFileTypes'],
      pdf: ['title', 'thumbNail', 'mediaFile', 'pdfFileTypes'],
      link: ['title', 'thumbNail', 'link'],
      document: ['title', 'mediaFile', 'thumbNail', 'documentFileTypes']
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

  const documentFileTypesText = showField('documentFileTypes')
    ? documentFileTypes.length > 1
      ? documentFileTypes.slice(0, -1).join(', ') +
        ', or ' +
        documentFileTypes[documentFileTypes.length - 1]
      : documentFileTypes.join('')
    : '';

  return (
    <Box className={'upload__media-screen'}>
      <Typography component="h1" variant="h1">
        {t('User Notes')}
      </Typography>
      <s.StyledListItem>
        {t(
          'Do not log-in to your account in multiple windows and try to upload many files at the same time.'
        )}
      </s.StyledListItem>
      <s.StyledListItem>
        {t(
          'Do not try to upload the same file in multiple windows or on multiple computers. We could pay to prevent you from doing this or you could just not.'
        )}
      </s.StyledListItem>
      <s.StyledListItem>
        {t(
          'Ensure the file type you select below is the same as the file type you upload.'
        )}
      </s.StyledListItem>
      <Typography component="h4" variant="h4" mt={2.5}>
        {t('* Your Requests Consume Energy & Resources, Be Mindful *')}
      </Typography>
      <Typography component="h2" variant="h2">
        {t('Media')}
      </Typography>

      {!editMode && (
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
            <MenuItem.li value={ContentTypes.Document}>
              {t('Word Document')}
            </MenuItem.li>
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
      )}
      {showField('title') || editMode ? (
        <Box my={theme.spacing(5)}>
          <TextInput
            control={control}
            name="title"
            fullWidth
            placeholder={'Title (required)'}
            defaultValue={editMode ? content?.title : ''}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              `Your title will appear on the search page and play page. Keep it short, your content will also be searchable by the description & tags you'll add in a minute.`
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('mediaFile') && !editMode ? (
        <Box my={theme.spacing(5)}>
          <UploadInput
            key={uploadType}
            text={t('Media file (required)')}
            onDrop={handleMediaOnDrop}
            maxFiles={1}
            isUploadReady={isMediaUploadReady}
          />
          {mediaTypeError ? (
            <Typography component="p" variant="body2" color="#FFB7C4">
              {mediaTypeError}
            </Typography>
          ) : null}
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              `The file you upload here should correspond with the file type you have selected above. This is a shared network, to reduce energy and space consumption we only accept file types: ${pdfFileTypesText}${videoFileTypesText}${audioFileTypesText}${documentFileTypesText} no more than 2 GB.`
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('thumbNail') || editMode ? (
        <Box my={theme.spacing(5)}>
          <UploadInput
            text={t('Thumbnail image (required)')}
            onDrop={handleThumbnailOnDrop}
            maxFiles={1}
            isUploadReady={!editMode ? isThumbUploadReady : true}
            currentImage={content?.coverImageUrl?.playerInfo?.publicUrl}
            newImage={newImage}
            editMode={editMode}
            editType="Cover"
          />

          {imageTypeError ? (
            <Typography component="p" variant="body2" color="#FFB7C4">
              {imageTypeError}
            </Typography>
          ) : null}
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'Upload a Thumbnail image. For best results, we recommend 720px by 720px. The file size should not exceed 500 KB.'
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('thumbNail') || editMode ? (
        <Box my={theme.spacing(5)}>
          <TextInput
            control={control}
            name="imageText"
            placeholder={t('Thumbnail Image alt text (required)')}
            defaultValue={editMode ? content?.coverImageText : ''}
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
            isUploadReady={!editMode ? isBannerUploadReady : true}
            currentImage={content?.bannerImageUrl?.playerInfo?.publicUrl}
            newImage={newBannerImage}
            editMode={editMode}
            editType="Banner"
          />
          {bannerImageTypeError ? (
            <Typography component="p" variant="body2" color="#FFB7C4">
              {bannerImageTypeError}
            </Typography>
          ) : null}
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
            defaultValue={editMode ? content?.bannerImageText : ''}
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
            defaultValue={editMode ? content?.externalUrl : ''}
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
