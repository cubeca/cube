import { Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useEditProfile from './useEditProfile';
import CameraIcon from '@mui/icons-material/LocalSee';
import TextInput from 'components/form/TextInput';
import * as s from './EditProfileForm.styled';
import * as sRadioInput from 'components/form/RadioInput/RadioInput.styled';
import UploadInput from 'components/form/UploadInput';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Box } from '@mui/system';

interface EditProfileFormProps {
  profile: any;
  onSave: () => void;
  onUploadComplete: () => void;
}

const EditProfileForm = ({
  profile,
  onSave,
  onUploadComplete
}: EditProfileFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const {
    updateSection,
    updateLogo,
    updateAudioDescription,
    updateHero,
    isUploadingHero,
    isUploadingLogo
  } = useEditProfile(profile.tag);
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
    onUploadComplete();
  };

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

  const onChangeLogo = async (e: any) => {
    const file = e.target.files[0];
    await updateLogo(profile.id, file);
    onUploadComplete();
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedLogo(reader.result as any);
    };
    reader.readAsDataURL(file);
  };

  const onChangeHero = async (e: any) => {
    const file = e.target.files[0];
    await updateHero(profile.id, file);
    onUploadComplete();
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedHero(reader.result as any);
    };
    reader.readAsDataURL(file);
  };

  const onChangeAudioDescription = (files: File[]) => {
    setIsAudioUploadComplete(false);
    const file = files[0];
    updateAudioDescription(profile.id, file);
    setIsAudioUploadComplete(true);
  };

  const logoIdUpload = 'logo-upload';
  const heroIdUpload = 'hero-upload';

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  return (
    <Stack direction="column">
      <s.EditProfileImagesWrapper>
        <s.EditProfileHeroBg>
          {isUploadingHero ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Lottie
                className="loading-circle"
                animationData={LoadingCircle}
                loop={true}
                autoplay={true}
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          ) : (
            <>
              {profile.heroUrl && (
                <img
                  src={selectedHero || profile!.heroUrl}
                  alt="user profile hero"
                />
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
            </>
          )}
        </s.EditProfileHeroBg>
        <s.ImageWrapper>
          <s.ImageInner>
            {isUploadingLogo ? (
              <Lottie
                className="loading-circle"
                animationData={LoadingCircle}
                loop={true}
                autoplay={true}
              />
            ) : (
              profile.logoUrl && (
                <img
                  src={selectedLogo || profile!.logoUrl}
                  alt="user profile thumbnail"
                />
              )
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

      <Grid container flex-direction={{ xs: 'column', sm: 'column', md: 'row' }} justifyContent="space-between">
        <Grid xs={12} md="auto">
          <Box mt={2}>
            <HCaptcha
              theme="dark"
              sitekey={hCaptchaKey}
              onVerify={onCaptchaSuccess}
            />
          </Box>
        </Grid>
        <Grid xs={12} md="auto">
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={!captchaVerified}
              onClick={handleSubmit(onSubmitSection)}
            >
              {t('Update Profile')}
            </Button>
          </Box>
        </Grid>
      </Grid>

    </Stack>
  );
};

export default EditProfileForm;
