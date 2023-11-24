import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useEditProfile from './useEditProfile';
import CameraIcon from '@mui/icons-material/LocalSee';
import TextInput from 'components/form/TextInput';
import * as s from './EditProfileForm.styled';
import * as sRadioInput from 'components/form/RadioInput/RadioInput.styled';
import UploadInput from 'components/form/UploadInput';
import { useState } from 'react';

interface EditProfileFormProps {
  profile: any;
  onSave: () => void;
}

const EditProfileForm = ({ profile, onSave }: EditProfileFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const { updateSection, updateLogo, updateAudioDescription, updateHero } =
    useEditProfile(profile.tag);
  const [isAudioUploadComplete, setIsAudioUploadComplete] = useState(false);

  const onSubmitSection = (data: FieldValues) => {
    const { organization, website, profileDescription, budget } = data;
    updateSection(
      profile.id,
      organization,
      website,
      profileDescription,
      budget
    );
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

  const onChangeAudioDescription = (files: File[]) => {
    setIsAudioUploadComplete(false);
    const file = files[0];
    updateAudioDescription(profile.id, file);
    setIsAudioUploadComplete(true);
  };

  const logoIdUpload = 'logo-upload';
  const heroIdUpload = 'hero-upload';

  return (
    <Stack direction="column">
      <s.EditProfileImagesWrapper>
        <s.EditProfileHeroBg>
          {profile.heroUrl && (
            <img src={profile!.heroUrl} alt="user profile hero" />
          )}
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
            {profile.logoUrl && (
              <img src={profile!.logoUrl} alt="user profile thumbnail" />
            )}
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

      <TextInput
        colorMode="dark"
        defaultValue={profile.organization}
        name="organization"
        id="organization"
        control={control}
        fullWidth
        variant="outlined"
        label={t('Organization Name')}
      />
      <TextInput
        colorMode="dark"
        defaultValue={profile.website}
        name="website"
        id="website"
        control={control}
        fullWidth
        variant="outlined"
        label={t('Organization URL')}
      />
      <TextInput
        colorMode="dark"
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
      <sRadioInput.DarkRadioInput
        control={control}
        name="budget"
        label="Budget"
        id="budget"
        direction="vertical"
        defaultValue={profile.budget}
        options={[
          {
            value: '1',
            label: '100 to 10,000',
            id: '1'
          },
          {
            value: '2',
            label: '10,000 to 30,000',
            id: '2'
          },
          {
            value: '3',
            label: '30,000 to 80,000',
            id: '3'
          },
          {
            value: '4',
            label: '80,000+',
            id: '4'
          }
        ]}
      />

      <UploadInput
        text={t('Audio file describing the information above')}
        onDrop={onChangeAudioDescription}
        maxFiles={1}
        style={'dark'}
        isUploadComplete={isAudioUploadComplete}
      />

      <Stack direction="row" justifyContent="right">
        <Button color="secondary" onClick={handleSubmit(onSubmitSection)}>
          {t('Update Profile')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditProfileForm;
