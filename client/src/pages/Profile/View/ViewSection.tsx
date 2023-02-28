import { Box, Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import MediaPlayer from 'components/MediaPlayer';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from 'api/profile';
import EditIcon from '@mui/icons-material/Edit';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: Profile;
  onEdit: () => void;
}

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  const { t } = useTranslation();
  return (
  
  <Stack sx={{position: 'fixed', right: '-1vw', height: '100%', direction: 'column', backgroundImage: 'linear-gradient(90deg, rgba(40,52,60,0) 0%, rgba(40,52,60,0.2) 10%, rgba(40,52,60,0.4) 20%, rgba(40,52,60,0.7777704831932774) 33%, rgba(40,52,60,0.8702074579831933) 44%, rgba(40,52,60,1) 73%)'}}>
      <Stack sx={{direction: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '5vw', marginLeft: '5vw'}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20vh'}}>
    <img src={profile.logoUrl} alt="" style={{border: '5px black solid', borderRadius: '100%', height: '15vh'}}/>
    </Box>
  
   <Box component="span">
    <Typography component="span" variant="h3" textAlign="center">
       {profile!.name}
      </Typography>
      </Box>
      {isLoggedIn && (
    <Box position="relative" top="-25vh" right="-4vw">
            <Button onClick={onEdit} variant="text" startIcon={<EditIcon />}>
              
            </Button>
    </Box>
    )}
    <Typography component="p" textAlign="center" width="20vw" marginTop="8vh">
      {profile.description}
    </Typography>
    </Stack>
  </Stack>
  );
};

export default ViewSection;
