/**
 * The `Media` screen is the first screen within the upload flow and serves to handle the selection of the media type to be uploaded,
 * the media's title to be displayed on the site, as well as the actual media file selection, cover image file selection, and cover image
 * alt text input. It also includes the option to upload a banner image and banner image alt text when uploading link content.
 * File validation is performed to ensure that the selected files are of the correct type and size.
 * The component dynamically adjusts its behaviour and validations based on the `uploadType` and `editMode`
 * props, allowing for flexible use in different contexts (e.g., new uploads vs editing existing content).
 *
 * @param {Object} control The `control` object provided by `react-hook-form`, used for managing form inputs.
 * @param {Function} handleMediaUpload Callback function for handling the upload of the main media file.
 * @param {Function} handleCoverImageUpload Callback function for handling the upload of the cover image.
 * @param {Function} handleBannerImageUpload Callback function for handling the upload of the banner image.
 * @param {string} uploadType A string indicating the type of upload, which influences validation and behavior.
 * @param {Function} setIsMediaProperFileType Callback function to set the state indicating if the media file is of a proper file type.
 * @param {Function} setIsCoverImageProperFileType Callback function to set the state indicating if the cover image is of a proper file type.
 * @param {Function} setIsBannerImageProperFileType Callback function to set the state indicating if the banner image is of a proper file type.
 * @param {boolean} editMode A boolean indicating if the component is being used to edit existing content, affecting default values and validations.
 * @param {Object} content An object containing existing content details, used in edit mode to populate form fields with existing values.
 */

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
  const maxUploadFileSize =
    process.env.REACT_APP_SHOW_BANNER === 'true' ? 0.01 : 2; // This env var is a proxy to determine production versus non-production

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
      setMediaTypeAccepted,
      maxUploadFileSize
    );
    handleMediaUpload(files);
  };

  const handleThumbnailOnDrop = (files: File[]) => {
    handleFileChange(
      files[0],
      'image',
      setImageTypeError,
      setImageTypeAccepted,
      0.02
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
      setBannerImageTypeAccepted,
      0.02
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
      {!editMode && (
        <>
          <Typography component="h1" variant="h1">
            {t('User Notes')}
          </Typography>
          <s.StyledListItem>
            {t(
              "Don't log in to your account in multiple windows.  If you try uploading multiple files simultaneously, all you'll get is loading GIFs."
            )}
          </s.StyledListItem>
          <s.StyledListItem>
            {t(
              'Do not try to upload the same file in multiple windows or on multiple computers.'
            )}
          </s.StyledListItem>
          <s.StyledListItem>
            {t(
              'Make sure the media type you select matches the file type you upload; or right when you think you’re done, you’ll have to start over.'
            )}
          </s.StyledListItem>
          <s.StyledListItem>
            {t('Translate this form into more than 12 languages using your browser “translate” tool. See instructions on our landing page.')}
          </s.StyledListItem>
          <s.StyledListItem>
            {t('|FR| Traduisez ce formulaire en français, à l`aide de l`outil « traduire » de votre navigateur. Voir les instructions sur notre page de destination.')}
          </s.StyledListItem>
          <Typography component="h4" variant="h4" mt={2.5}>
            {t('* Every click is powered by energy & resources, be mindful *')}
          </Typography>
        </>
      )}
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
              `Based on the media type you have selected, you can upload these file types: ${pdfFileTypesText}${videoFileTypesText}${audioFileTypesText}${documentFileTypesText} no more than ${maxUploadFileSize} GB.   `
            )}
          </Typography>
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              `This is a shared network - please reduce file size as much as possible.   `
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
