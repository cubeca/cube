import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import MediaPlayer from 'components/MediaPlayer';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from 'types/profile';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: Profile;
  onEdit: () => void;
}

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="column">
      <Stack direction="row">
        <img src={profile.logoUrl} alt="" />
        <Typography component="h2" variant="h3" pl="20px">
          {profile!.name}
        </Typography>
        {isLoggedIn && <Button onClick={onEdit}>{t('Edit Section')}</Button>}
      </Stack>
      <Typography component="p" py="2rem">
        {profile.description}
      </Typography>
      <MediaPlayer url={profile.descriptionUrl} isAudio />
    </Stack>
  );
};

export default ViewSection;
