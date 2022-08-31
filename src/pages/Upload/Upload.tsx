import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import ChipInput from 'components/form/ChipInput';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import useCollaborators from 'hooks/useCollaborators';
import useMedia from 'hooks/useMedia';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaTypes } from 'types/enums';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Upload = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const { addMedia, isLoading, isError, isSuccess } = useMedia();
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [VTTFiles, setVTTFiles] = useState<File[]>([]);
  const { data: collaborators, isLoading: isCollaboratorsLoading } =
    useCollaborators();
  const [value, setValue] = useState<dateFns | null>(null);

  const onSubmit = (values: FieldValues) => {
    addMedia({
      profileId: id!,
      title: values.title,
      type: values.type,
      expiry: values.expiry,
      description: values.description,
      coverImageText: values.imageText,
      coverImageFile: coverImageFile!,
      mediaFile: mediaFile!,
      collaborators: [values.collaborators],
      contributors: [values.contributors],
      tags: [values.tags]
    });
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
    <Stack px="5rem">
      <Box pt="2rem" width="50%">
        <Box>{t('Media Type')}</Box>
        <Box pt="1rem">
          <Select
            label={t('Media Type')}
            name="type"
            control={control}
            fullWidth={false}
            defaultValue=""
          >
            <MenuItem value={MediaTypes.Video}>{t('Video')}</MenuItem>
            <MenuItem value={MediaTypes.Audio}>{t('Audio')}</MenuItem>
            <MenuItem value={MediaTypes.PDF}>{t('PDF')}</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box pt="2rem" width="50%">
        <Box>{t('What is the Title?')}</Box>
        <Box>
          <TextInput
            control={control}
            name="title"
            fullWidth
            variant="outlined"
            placeholder={t('Title')}
          />
        </Box>
      </Box>
      <Box pt="2rem" width="50%">
        <Box>
          {t(
            'You can include an expiration date for content that is only licensed for a period.'
          )}
        </Box>
        <Box pt="1rem">
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
        </Box>
      </Box>
      <Grid container pt="2rem">
        <Grid xs={6}>
          <Stack>
            <Box>{t('Description')}</Box>
            <Box>
              <TextInput
                control={control}
                name="description"
                placeholder={t('Description here')}
                variant="outlined"
                multiline
                rows={8}
                fullWidth
              />
            </Box>
          </Stack>
        </Grid>
        <Grid xs={6}>
          <Box pl="2rem">
            <Typography component="p">{t('Best Practices:')}</Typography>
            <Typography component="p" pt="1rem">
              {t(
                `Though this text will be accessible to screen reading tools, it's important to remember that different accessibilities are assisted by different kinds of description. Use language in your text that considers a broad audience and is no greater than 280 characters.`
              )}
            </Typography>
            <Typography component="p" pt="1rem">
              {t(
                'Using your phone or computer record a quick 1-2min description that includes not only the information in the text but a description of where the video is shot, and some of the key visuals in the video.'
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
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
      </Box>
      <Box pt="2rem" width="50%">
        <Box pb="1rem">{t('Upload a Cover Image')}</Box>
        <UploadInput
          text={t('Drag photo to upload')}
          onDrop={handleCoverImageUpload}
          maxFiles={1}
        />
      </Box>
      <Grid container pt="2rem">
        <Grid xs={6}>
          <Box>{t('Type out alt text for the photo above')}</Box>
          <Box>
            <TextInput
              control={control}
              name="imageText"
              placeholder={t('Describe the image here')}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Grid>
        <Grid xs={6}>
          <Box pl="2rem" pt="2rem">
            {t(
              'Alt text should describe who or what is in the picture, atmospheric or prop details and any vibrant colors or important design elements or symbols'
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container pt="2rem">
        <Grid xs={6}>
          <Box pb="1rem">{t('Upload Your Media File')}</Box>
          <UploadInput
            text={t('Drag Media to upload')}
            onDrop={handleMediaUpload}
            maxFiles={1}
          />
        </Grid>
        <Grid xs={6}>
          <Box pl="2rem" pt="2rem">
            {t(
              'This is a shared network, to reduce energy and space consumption please upload files X, X or X, no more than X MB.'
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container pt="2rem">
        <Grid xs={6}>
          <Box>
            {t(
              'Upload VTT File For Subtitles (use multiple fields for different language files)'
            )}
          </Box>
          <Box pt="1rem">
            <UploadInput
              text={t('Drag VTT file(s) to upload')}
              onDrop={handleVTTFilesUpload}
              maxFiles={1}
            />
          </Box>
        </Grid>
        <Grid xs={6}>
          <Box pl="2rem" pt="2rem">
            {t(
              'VTT files ensure your content has subtitles. Closed captions include information about background sounds and speaker changes. Subtitles assume the viewer hears the audio and as a result does not contain background information. Please format the file to have this code at the top to ensure it adapts to various screen sizes'
            )}
            <br />
            {t('Code')}: XXX
          </Box>
        </Grid>
      </Grid>
      <Box pt="2rem" width="50%">
        <Grid container>
          <Grid xs={6}>
            <Box>{t('Add a Sign-language Option To Your Video')}</Box>
            <Box pt="1rem">
              <Button>{t('Book with Deaf Spectrum')}</Button>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box pl="2rem" pt="2rem">
              {t(
                'We encourage everyone to add sign language to their video content. Cube has a partnership with Deaf Spectrum who is able to book Signers willing to be videoed for content online. This does not need to be uploaded at the same time your content is. If you book using the button here, which is a portal to Deaf Spectrum’s site, signers are given the time they need to produce video content and the video is added later as a picture on picture option for users who select it.'
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Typography variant="h4" component="h4" pt="2rem">
        {t('Collaborators')}
      </Typography>
      <Box pt="2rem" width="50%">
        <Box>
          {t(
            'Credit any organizations on Cube who contributed to this content'
          )}
        </Box>
        <Box>
          <ChipInput
            control={control}
            name="collaborators"
            fullWidth
            chips={collaborators || []}
          />
        </Box>
      </Box>
      <Box pt="2rem" width="50%">
        <Box>
          {t(
            'Credit any individuals who contribute to this content, including artists, editors, etc (they do not need to have a profile on Cube):'
          )}
        </Box>
        <Box>
          <TextInput
            control={control}
            name="contributor"
            fullWidth
            variant="outlined"
            placeholder={t('e.g. Editor -> Editor Name')}
          />
        </Box>
        <Box>
          <Button variant="text">{t('+ add more')}</Button>
        </Box>
      </Box>
      <Typography variant="h4" component="h4" pt="2rem">
        {t('Add Your Content Tags')}
      </Typography>
      <Box pt="2rem" width="50%">
        <Box>
          {t(
            'Tags are our way of expanding the terms by which users can search content. They also contribute to your govenance token holdings by expressing how inclusive and accessible your content is. If you want content to be bundled under an exhibition name please create that tag:'
          )}
        </Box>
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
        </Box>
      </Box>
      <Stack py="2rem">
        <Box>
          <Button
            onClick={handleSubmit(onSubmit)}
            fullWidth={false}
            disabled={isLoading}
          >
            {t('Ready to upload Video to Main Page')}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Upload;
