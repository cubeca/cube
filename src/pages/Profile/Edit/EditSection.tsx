import { Link, Stack } from '@mui/material';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Profile } from 'types/profile';
import useEditProfile from './useEditProfile';

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
      <Link
        component="button"
        variant="body2"
        onClick={() => {
          setEditLogo(!editLogo);
        }}
      >
        {editLogo ? t('Cancel') : t('Edit Logo')}
      </Link>
      {editLogo && <input type="file" id="logo" onChange={onChangeLogo} />}
      <Stack direction="row">
        {logoUrl && <img src={logoUrl} alt="" />}
        <TextInput
          id="profileName"
          name="profileName"
          control={control}
          defaultValue={profile.name}
        />
        <Button onClick={handleSubmit(onSubmitSection)}>{t('Done')}</Button>
        <Button onClick={() => setIsEditing(false)}>{t('Cancel')}</Button>
      </Stack>
      <TextInput
        defaultValue={profile.description}
        name="profileDescription"
        id="profileDescription"
        control={control}
        multiline
        rows={4}
        fullWidth
      />
      <Link
        component="button"
        variant="body2"
        onClick={() => {
          setEditAudio(!editAudio);
        }}
      >
        {editAudio
          ? t('Cancel')
          : t('Upload an audio file describing the information above')}
      </Link>
      {editAudio && (
        <input
          type="file"
          id="audio-description"
          onChange={onChangeAudioDescription}
        />
      )}
    </Stack>
  );
};

export default EditSection;
