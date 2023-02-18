import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
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

const Upload = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const {
    addContent,
    isUploadLoading: isLoading,
    isUploadError: isError,
    isUploadSuccess: isSuccess
  } = useContent();
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [VTTFiles, setVTTFiles] = useState<File[]>([]);
  // const { data: collaborators, isLoading: isCollaboratorsLoading } =
  //   useCollaborators();
  const [value, setValue] = useState<dateFns | null>(null);

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

  const handleCoverImageUpload = (files: File[]) => {
    setCoverImageFile(files[0]);
  };

  const handleMediaUpload = (files: File[]) => {
    setMediaFile(files[0]);
  };

  const handleVTTFilesUpload = (files: File[]) => {
    setVTTFiles(files);
  };

  if (isSuccess) {
    navigate(`/profile/${id!}`);
  }

  if (isError) {
    alert('Error');
  }

  return (
    <Stack>
        <Grid container spacing={2}>
          <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
            
            <Box>
              <Typography component="h2" variant="h2">{t('Media')}</Typography>
            </Box>

            <Box>
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
            </Box>

            <Box>
              <TextInput
                control={control}
                name="title"
                fullWidth
                variant="outlined"
                placeholder={t('Title (required)')}
              />
              <Typography component="p" variant="body2">{t('What is the title of this work? This is the name that people will see when they search for and view your content. Keep this short, you will be able to provide a longer description on the next screen.')}</Typography>
            </Box>

            <Box>
              <UploadInput
                text={t('Media file (required)')}
                onDrop={handleMediaUpload}
                maxFiles={1}
              />
              <Typography component="p" variant="body2">{t('Upload your video. This is a shared network, to reduce energy and space consumption please upload files xxx, xxx or xxx, no more than xx mb. While your video uploads you can continue filling out the rest of this form. You will be able to submit your entry once the upload has finished.')}</Typography>
            </Box>

            <Box>
              <UploadInput
                text={t('Thumbnail image (required)')}
                onDrop={handleCoverImageUpload}
                maxFiles={1}
              />
              <Typography component="p" variant="body2">{t('Upload a Thumbnail Image. Recommended image dimensions are xxx by xxx. File size should not exceed xxx kb.')}</Typography>
            </Box>

            <Box>
              <TextInput
                control={control}
                name="imageText"
                placeholder={t('Thumbnail Image alt text (required)')}
                fullWidth
                variant="outlined"
              />
              <Typography component="p" variant="body2">{t('Alt text should describe who or what is in the picture, atmospheric or prop details and any vibrant colours or important design elements or symbols')}</Typography>
            </Box>

            <Box>
              <TextInput
                control={control}
                name="description"
                placeholder={t('Description (required)')}
                variant="outlined"
                multiline
                rows={8}
                fullWidth
              />
              <Typography component="p" variant="body2">{t(`Though this text will be accessible to screen reading tools, it's important to remember that different accessibilities are assisted by different kinds of description. Use language in your text that considers a broad audience and is no greater than 280 characters.`)}</Typography>
            </Box>

            <Box>
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
              <Typography component="p" variant="body2">{t('Using your phone or computer record a quick 1-2min description that includes not only the information in the text but a description of where the video is shot, and some of the key visuals in the video.')}</Typography>
            </Box>

            <Box>
              <UploadInput
                text={t('VTT file (required)')}
                onDrop={handleVTTFilesUpload}
                maxFiles={1}
              />
              <Typography component="p" variant="body2">
                {t('Upload VTT File For Subtitles. VTT files ensure your content has subtitles. Closed captions include information about background sounds and speaker changes. Subtitles assume the viewer hears the audio and as a result does not contain background information. Please format the file to have this code at the top to ensure it adapts to various screen sizes')}
                <br />
                {t('Code')}: XXX
              </Typography>
            </Box>

            <Box>
              <DatePicker
                label={t('Expiry Date')}
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
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
              <Typography component="p" variant="body2">{t('You can include an expiration date for content that is only licensed for a period.')}</Typography>
            </Box>

            <Box>
              <Typography component="h2" variant="h2">{t('Accessibility')}</Typography>
              <Typography component="h5" variant="h5">{t('Add a Sign-language Option To Your Video')}</Typography>
              <Typography component="p">{t('We encourage everyone to add sign language to their video content. Cube has a partnership with Deaf Spectrum who is able to book Signers willing to be videoed for content online. This does not need to be uploaded at the same time your content is. If you book using the button here, which is a portal to Deaf Spectrum’s site, signers are given the time they need to produce video content and the video is added later as a picture on picture option for users who select it.')}</Typography>
              <Button>{t('Book with Deaf Spectrum')}</Button>
            </Box>
            
            <Typography component="h2" variant="h2">{t('Tags')}</Typography>

            <Box>
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
              <Typography component="p" variant="body2">{t('Separate tags by comma. Tags are our way of expanding the terms by which users can search content. They also contribute to your govenance token holdings by expressing how inclusive and accessible your content is. If you want content to be bundled under an exhibition name please create that tag:')}</Typography>
            </Box>
              
            <Box>
              <Typography component="p" variant="body2">{t('Credit any individuals who contribute to this content, including artists, editors etc. Add as many contributors as needed, using “Add more”. Only one name per field.')}</Typography>
              <TextInput
                control={control}
                name="contributor"
                fullWidth
                variant="outlined"
                placeholder={t('e.g. Editor -> Editor Name')}
              />
              <Button variant="text">{t('+ add more')}</Button>
            </Box>
            
            <Box>
              <ChipInput
                control={control}
                name="collaborators"
                fullWidth
                // chips={collaborators || []}
                chips={[]}
              />
              <Typography component="p" variant='body2'>{t('Did you work with another organization? Include them in the credits. Separate collaborators by comma.')}</Typography>
            </Box>

            <Box>
              <Button
                onClick={handleSubmit(onSubmit)}
                fullWidth={false}
                disabled={isLoading}
              >
                {t('Submit')}
              </Button>
            </Box>
            
          </Grid>
        </Grid>

    </Stack>
  );
};

export default Upload;
