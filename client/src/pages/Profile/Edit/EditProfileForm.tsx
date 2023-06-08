import { Box, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useEditProfile from './useEditProfile';
import CameraIcon from '@mui/icons-material/LocalSee';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as s from './EditProfileForm.styled';
import * as sTextInput from 'components/form/TextInput/TextInput.styled';
import FPOProfileUrl from 'assets/images/profile-user-image.png';
import profileHeroUrl from 'assets/images/profile-hero-bg.jpg';

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
          <img src={profile.herourl || profileHeroUrl} alt="user profile hero" />
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
            <img src={profile.logourl || FPOProfileUrl} alt="profile thumbnail" />
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
      
      
      <sTextInput.DarkTextInput
        defaultValue={profile.organization}
        name="organization"
        id="organization"
        sx={{ color:  '#28343C' }}
        control={control}
        fullWidth
        variant="outlined"
        label={t('Organization Name')}
      />
      <sTextInput.DarkTextInput
        defaultValue={profile.website}
        name="website"
        id="website"
        sx={{ color:  '#28343C' }}
        control={control}
        fullWidth
        variant="outlined"
        label={t('Organization URL')}
      />
      <sTextInput.DarkTextInput
        defaultValue={profile.description}
        name="profileDescription"
        id="profileDescription"
        sx={{ color:  '#28343C' }}
        control={control}
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        label={t('Description')}
      />

      <Button
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
      <Box>
        <Button onClick={handleSubmit(onSubmitSection)}>
          {t('Update Profile')}
        </Button>
      </Box>
    </Stack>
  );
};

export default EditProfileForm;
