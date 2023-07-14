import { Box, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useEditProfile from './useEditProfile';
import CameraIcon from '@mui/icons-material/LocalSee';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TextInput from 'components/form/TextInput';
import * as s from './EditProfileForm.styled';
import FPOProfileUrl from 'assets/images/profile-user-image.png';
import profileHeroUrl from 'assets/images/profile-hero-bg.jpg';
import UploadInput from 'components/form/UploadInput';

interface EditProfileFormProps {
  profile: any;
  onSave: () => void;
}

const EditProfileForm = ({ profile, onSave }: EditProfileFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const { updateSection, updateLogo, updateAudioDescription, updateHero } =
    useEditProfile(profile.id);
  const [logoUrl] = useState(profile.logoUrl);
  const [heroUrl] = useState(profile.heroUrl);
  const [editAudio, setEditAudio] = useState(false);

  const onSubmitSection = (data: FieldValues) => {
    const { profileDescription } = data;
    updateSection(profile.id, profileDescription);
    onSave();
  };

  const onChangeLogo = (e: any) => {
    const file = e.target.files[0];
    updateLogo(profile.id, file);
  };

  const onChangeHero = (e: any) => {
    const file = e.target.files[0];
    updateHero(profile.id, file);
  };

  const onChangeAudioDescription = (e: any) => {
    const file = e.target.files[0];
    updateAudioDescription(profile.id, file);
  };

  const logoIdUpload = 'logo-upload';
  const heroIdUpload = 'hero-upload';

  return (
    <Stack direction="column">
      <s.EditProfileImagesWrapper>
        <s.EditProfileHeroBg>
          <img
            src={profile.herourl || profileHeroUrl}
            alt="user profile hero"
          />
          <label htmlFor={heroIdUpload} style={{ cursor: 'pointer' }}>
            <CameraIcon />
            <Typography>Upload</Typography>
            <input
              type="file"
              id={heroIdUpload}
              onChange={onChangeHero}
              style={{ display: 'none' }}
            />
          </label>
        </s.EditProfileHeroBg>
        <s.ImageWrapper>
          <s.ImageInner>
            <img
              src={profile.logourl || FPOProfileUrl}
              alt="profile thumbnail"
            />
          </s.ImageInner>
          <s.EditWrapper>
            <label htmlFor={logoIdUpload} style={{ cursor: 'pointer' }}>
              <CameraIcon />
              <Typography>Upload</Typography>
              <input
                type="file"
                id={logoIdUpload}
                onChange={onChangeLogo}
                style={{ display: 'none' }}
              />
            </label>
          </s.EditWrapper>
        </s.ImageWrapper>
      </s.EditProfileImagesWrapper>

      <s.EditFieldsWrapper>
        <TextInput
          className='dark'
          defaultValue={profile.organization}
          name="organization"
          id="organization"
          control={control}
          fullWidth
          variant="outlined"
          label={t('Organization Name')}
        />
        <TextInput
          className='dark'
          defaultValue={profile.website}
          name="website"
          id="website"
          control={control}
          fullWidth
          variant="outlined"
          label={t('Organization URL')}
        />
        <TextInput
          className='dark'
          defaultValue={profile.description}
          name="profileDescription"
          id="profileDescription"
          control={control}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          label={t('Description')}
        />
        {/*       
        <Button color='secondary'
          onClick={() => {
            setEditAudio(!editAudio);
          }}
          variant="text"
          endIcon={
            !editAudio && (
              <Box
                border="solid"
                borderRadius="5px"
                display="inline-block"
                lineHeight="0"
              >
                <FileUploadIcon />
              </Box>
            )
          }
        >
          {editAudio
            ? t('Cancel')
            : t('Upload an audio file describing the information above')}
        </Button>
        {editAudio && (

          <Box textAlign="center" pt="0.5rem">
            <input
              type="file"
              id="audio-description"
              onChange={onChangeAudioDescription}
            />
          </Box>
          
        )} 
        
        // @jonathan - this is was the old way, and below is what we have on the uploads page. Needs testing. 
        
        */}

        <UploadInput
          text={t('Audio file describing the information above')}
          onDrop={onChangeAudioDescription}
          maxFiles={1}
          style={'dark'}
        />

        <Stack direction="row" justifyContent="right">
          <Button color="secondary" onClick={handleSubmit(onSubmitSection)}>
            {t('Update Profile')}
          </Button>
        </Stack>

      </s.EditFieldsWrapper>
    </Stack>
  );
};

export default EditProfileForm;