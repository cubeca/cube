import {
  Box,
  MenuItem,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import ChipInput from 'components/form/ChipInput';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import useCollaborators from 'hooks/useCollaborators';
import useContent from 'hooks/useContent';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentTypes } from 'types/enums';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Breadcrumb from './components/Breadcrumb';
import Progress from './components/Progress';

const Screens = ({
  control,
  handleMediaUpload,
  handleCoverImageUpload,
  expiryValue,
  onExpriryValueChange,
  handleVTTFilesUpload
}: any) => {
  return (
    <Stack className={'upload__screens'}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          <Media
            control={control}
            handleMediaUpload={handleMediaUpload}
            handleCoverImageUpload={handleCoverImageUpload}
          />
          <Details
            control={control}
            handleVTTFilesUpload={handleVTTFilesUpload}
            expiryValue={expiryValue}
            onExpriryValueChange={onExpriryValueChange}
          />
          <Accessibility />
          <Tags control={control} />
        </Grid>
      </Grid>
    </Stack>
  );
};

const Media = ({ control, handleMediaUpload, handleCoverImageUpload }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const vertical_spacing_lg = theme.spacing(5);
  const vertical_spacing_sm = theme.spacing(2.5);

  return (
    <Box className={'upload__media-screen'}>
      <Typography component="h2" variant="h2">
        {t('Media')}
      </Typography>

      <Box my={vertical_spacing_lg}>
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
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'What type of media are you uploading? Don’t see the type you need in this list? Contact us.'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <TextInput
          control={control}
          name="title"
          fullWidth
          variant="outlined"
          placeholder={t('Title (required)')}
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'What is the title of this work? This is the name that people will see when they search for and view your content. Keep this short, you will be able to provide a longer description on the next screen.'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <UploadInput
          text={t('Media file (required)')}
          onDrop={handleMediaUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Upload your video. This is a shared network, to reduce energy and space consumption please upload files xxx, xxx or xxx, no more than xx mb. While your video uploads you can continue filling out the rest of this form. You will be able to submit your entry once the upload has finished.'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <UploadInput
          text={t('Thumbnail image (required)')}
          onDrop={handleCoverImageUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Upload a Thumbnail Image. Recommended image dimensions are xxx by xxx. File size should not exceed xxx kb.'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <TextInput
          control={control}
          name="imageText"
          placeholder={t('Thumbnail Image alt text (required)')}
          fullWidth
          variant="outlined"
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Alt text should describe who or what is in the picture, atmospheric or prop details and any vibrant colours or important design elements or symbols'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

const Details = ({
  control,
  handleVTTFilesUpload,
  expiryValue,
  onExpriryValueChange
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const vertical_spacing_lg = theme.spacing(5);
  const vertical_spacing_sm = theme.spacing(2.5);

  return (
    <Box className={'upload__details-screen'}>
      <Typography component="h2" variant="h2">
        {t('Details')}
      </Typography>

      <Box my={vertical_spacing_lg}>
        <TextInput
          control={control}
          name="description"
          placeholder={t('Description (required)')}
          variant="outlined"
          multiline
          rows={8}
          fullWidth
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            `Though this text will be accessible to screen reading tools, it's important to remember that different accessibilities are assisted by different kinds of description. Use language in your text that considers a broad audience and is no greater than 280 characters.`
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <Button
          onClick={() => {}}
          variant="text"
          endIcon={
            <Box
              border="solid"
              borderRadius="5px"
              display="inline-block"
              lineHeight="0"
            >
              <FileUploadIcon />
            </Box>
          }
        >
          {t('Upload an audio file describing the information above')}
        </Button>
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Using your phone or computer record a quick 1-2min description that includes not only the information in the text but a description of where the video is shot, and some of the key visuals in the video.'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <UploadInput
          text={t('VTT file (required)')}
          onDrop={handleVTTFilesUpload}
          maxFiles={1}
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Upload VTT File For Subtitles. VTT files ensure your content has subtitles. Closed captions include information about background sounds and speaker changes. Subtitles assume the viewer hears the audio and as a result does not contain background information. Please format the file to have this code at the top to ensure it adapts to various screen sizes'
          )}
          <br />
          {t('Code')}: XXX
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
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

        <Typography component="p" variant="body2">
          {t(
            'Regardless of your location, you’re legally required to comply with the Children’s Online Privacy Protection Act (COPPA) and/or other laws. You’re required to tell us whether your videos are made for kids. What’s content made for kids?'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
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
              // placeholder={t('Expiry Date')}
              // fullWidth
              // variant="outlined"
              {...params}
            />
          )}
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'You can include an expiration date for content that is only licensed for a period.'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

const Accessibility = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const vertical_spacing_lg = theme.spacing(5);
  const vertical_spacing_sm = theme.spacing(2.5);

  return (
    <Box className={'upload__accessibility-screen'}>
      <Typography component="h2" variant="h2">
        {t('Accessibility')}
      </Typography>

      <Box my={vertical_spacing_lg}>
        <Typography component="h5" variant="h5">
          {t('Add a Sign-language Option To Your Video')}
        </Typography>
        <Typography component="p">
          {t(
            'We encourage everyone to add sign language to their video content. Cube has a partnership with Deaf Spectrum who is able to book Signers willing to be videoed for content online. This does not need to be uploaded at the same time your content is. If you book using the button here, which is a portal to Deaf Spectrum’s site, signers are given the time they need to produce video content and the video is added later as a picture on picture option for users who select it.'
          )}
        </Typography>
        <Button>{t('Book with Deaf Spectrum')}</Button>
      </Box>
    </Box>
  );
};

const Tags = ({ control }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const vertical_spacing_lg = theme.spacing(5);
  const vertical_spacing_sm = theme.spacing(2.5);

  return (
    <Box className={'upload__tags-screen'}>
      <Typography component="h2" variant="h2">
        {t('Tags')}
      </Typography>

      <Box my={vertical_spacing_lg}>
        <ChipInput
          control={control}
          name="collaborators"
          fullWidth
          chips={[
            'Live Performance',
            'Workshop',
            'Kids Workshop',
            'Artist Talk',
            'Language Teaching',
            'Cultural Teaching',
            'Studio Visit',
            'Gathering',
            'Book Launch',
            'Subtitles',
            'Sign Language',
            'Multilingual Subtitles',
            'Tsleil-Waututh',
            'kʷakʷəkʲəʔwakʷ',
            'Sḵwx̱wúʔmesh',
            'Anishinaabe',
            'French',
            'Chinese',
            'BC',
            'Alberta',
            'Québec',
            'Regina',
            'Manitoba',
            'Toronto'
          ]}
        />
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Separate tags by comma. Tags are our way of expanding the terms by which users can search content. They also contribute to your govenance token holdings by expressing how inclusive and accessible your content is. If you want content to be bundled under an exhibition name please create that tag:'
          )}
        </Typography>
      </Box>

      <Box my={vertical_spacing_lg}>
        <Typography component="p" variant="body2" my={vertical_spacing_sm}>
          {t(
            'Credit any individuals who contribute to this content, including artists, editors etc. Add as many contributors as needed, using “Add more”. Only one name per field.'
          )}
        </Typography>
        <TextInput
          control={control}
          name="contributor"
          fullWidth
          variant="outlined"
          placeholder={t('e.g. Editor -> Editor Name')}
        />
        <Button variant="text">{t('+ add more')}</Button>
      </Box>

      <Box my={vertical_spacing_lg}>
        <ChipInput
          control={control}
          name="collaborators"
          fullWidth
          // chips={collaborators || []}
          chips={[]}
        />
        <Typography component="p" variant="body2">
          {t(
            'Did you work with another organization? Include them in the credits. Separate collaborators by comma.'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

const Footer = ({ isLoading, handleSubmit, onSubmit }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box className={'upload__footer'} my={theme.spacing(5)}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          <Button
            onClick={handleSubmit(onSubmit)}
            fullWidth={false}
            disabled={isLoading}
          >
            {t('Submit')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Upload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();
  const {
    addContent,
    isUploadLoading: isLoading,
    isUploadError: isError,
    isUploadSuccess: isSuccess
  } = useContent();

  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [expiryValue, setExpiryValue] = useState<dateFns | null>(null);
  const [VTTFiles, setVTTFiles] = useState<File[]>([]);

  // const { data: collaborators, isLoading: isCollaboratorsLoading } =
  //   useCollaborators();

  const handleCoverImageUpload = (files: File[]) => {
    setCoverImageFile(files[0]);
  };

  const handleMediaUpload = (files: File[]) => {
    setMediaFile(files[0]);
  };

  const handleVTTFilesUpload = (files: File[]) => {
    setVTTFiles(files);
  };

  const onSubmit = (values: FieldValues) => {
    addContent(
      {
        profileId: id!,
        title: values.title,
        type: values.type,
        expiry: values.expiry,
        description: values.description,
        coverImageText: values.imageText,
        collaborators: [values.collaborators],
        contributors: [values.contributors],
        tags: [values.tags]
      },
      coverImageFile!,
      mediaFile!
    );
  };

  if (isSuccess) {
    navigate(`/profile/${id!}`);
  }

  if (isError) {
    alert('Error');
  }

  return (
    <Box className={'upload'}>
      <Breadcrumb />
      <Progress />
      <Screens
        control={control}
        handleCoverImageUpload={handleCoverImageUpload}
        handleMediaUpload={handleMediaUpload}
        handleVTTFilesUpload={handleVTTFilesUpload}
        expiryValue={expiryValue}
        onExpriryValueChange={setExpiryValue}
      />
      <Footer
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default Upload;
