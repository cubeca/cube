import { Box, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import MediaPlayer from 'components/MediaPlayer';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from 'types/profile';
import EditIcon from '@mui/icons-material/Edit';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: Profile;
  onEdit: () => void;
}

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="column">
      <Stack direction="row" justifyContent="space-between">
        <Box component="span">
          <img src={profile.logoUrl} alt="" />
          <Typography component="span" variant="h3" pl="20px">
            {profile!.name}
          </Typography>
        </Box>
        {isLoggedIn && (
          <Box>
            <Button onClick={onEdit} variant="text" startIcon={<EditIcon />}>
              {t('Edit Section')}
            </Button>
          </Box>
        )}
      </Stack>
      <Typography component="p" py="2rem">
        {profile.description}
      </Typography>
      <MediaPlayer url={profile.descriptionUrl} isAudio />
    </Stack>
  );
};

export default ViewSection;
