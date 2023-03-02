import { Box, Link, Stack } from '@mui/material';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Profile } from 'api/profile';
import useEditProfile from './useEditProfile';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface EditSectionProps {
  profile: Profile;
  setIsEditing: (isEditing: boolean) => void;
}

const EditSection: FC<EditSectionProps> = ({ profile, setIsEditing }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const { updateSection, updateLogo, updateAudioDescription } =
    useEditProfile();
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl);
  const [editLogo, setEditLogo] = useState(false);
  const [editAudio, setEditAudio] = useState(false);

  const onSubmitSection = (data: FieldValues) => {
    const { profileName, profileDescription } = data;
    updateSection(profile.id, profileName, profileDescription);
    setIsEditing(false);
  };

  const onChangeLogo = (e: any) => {
    const file = e.target.files[0];
    updateLogo(profile.id, file);
  };

  const onChangeAudioDescription = (e: any) => {
    const file = e.target.files[0];
    updateAudioDescription(profile.id, file);
  };

  return (
    <Stack direction="column">
      <Box>
        <Button
          onClick={() => {
            setEditLogo(!editLogo);
          }}
          variant="text"
          startIcon={<EditIcon />}
        >
          {editLogo ? t('Cancel') : t('Edit Logo')}
        </Button>
        {editLogo && (
          <Box component="span" pl="1rem">
            <input type="file" id="logo" onChange={onChangeLogo} />
          </Box>
        )}
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center">
          {logoUrl && (
            <Box component="span" pr="1rem">
              <img src={logoUrl} alt="" />
            </Box>
          )}
          <TextInput
            id="profileName"
            name="profileName"
            control={control}
            defaultValue={profile.name}
            variant="standard"
            sx={{ fontSize: '2rem' }}
          />
        </Stack>
        <Box>
          <Button onClick={handleSubmit(onSubmitSection)}>{t('Done')}</Button>
        </Box>
      </Stack>
      <TextInput
        defaultValue={profile.description}
        name="profileDescription"
        id="profileDescription"
        control={control}
        multiline
        rows={4}
        fullWidth
        variant="standard"
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
    </Stack>
  );
};

export default EditSection;
