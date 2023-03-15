import { Box, Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import MediaPlayer from 'components/MediaPlayer';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from 'api/profile';
import EditIcon from '@mui/icons-material/Edit';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: any;
  onEdit: () => void;
}

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        pt: '0',
        position: 'fixed',
        top: '0',
        right: '-1vw',
        height: '100%',
        direction: 'column',
        backgroundImage:
          'linear-gradient(90deg, rgba(40,52,60,0) 3%, rgba(40,52,60,0.3505996148459384) 10%, rgba(40,52,60,0.6979385504201681) 22%, rgba(40,52,60,0.809983368347339) 27%, rgba(40,52,60,0.9304315476190477) 33%, rgba(40,52,60,0.9640449929971989) 43%, rgba(40,52,60,1) 56%)'
      }}
    >
      <Stack
        sx={{
          direction: 'column',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '5vw',
          marginLeft: '5vw'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20vh'
          }}
        >
          <img
            src={profile.logoUrl}
            alt=""
            style={{
              border: '5px black solid',
              borderRadius: '100%',
              height: '15vh'
            }}
          />
        </Box>

        <Box component="span">
          <Typography component="span" variant="h3" textAlign="center">
            {profile!.organization}
          </Typography>
        </Box>
        {isLoggedIn && (
          <Box position="relative" top="-25vh" right="-4vw">
            <Button
              onClick={onEdit}
              variant="text"
              startIcon={<EditIcon />}
            ></Button>
          </Box>
        )}
        <Typography
          component="p"
          textAlign="center"
          width="20vw"
          marginTop="8vh"
        >
          {profile.description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ViewSection;
