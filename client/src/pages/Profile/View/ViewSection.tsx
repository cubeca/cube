import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import * as s from '../Profile.styled';
import MediaPlayer from 'components/MediaPlayer';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: any;
  onEdit: () => void;
}

const getUrl = (website: string) => {
  return website?.startsWith('http') ? website : `https://${website}`;
};

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  return (
    <s.ViewSection>
      <s.Header>
        <s.ImageWrapper>
          <s.ImageInner
            onClick={isLoggedIn ? onEdit : undefined}
            title={profile!.organization}
            target="_blank"
            style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}
          >
            {profile.logoUrl && (
              <img src={profile!.logoUrl} alt="user profile thumbnail" />
            )}
            {!profile && (
              <Lottie
                className="loading-circle"
                animationData={LoadingCircle}
                loop={true}
                autoplay={true}
              />
            )}
          </s.ImageInner>
          {isLoggedIn && (
            <s.EditWrapper>
              <button onClick={onEdit} style={{ cursor: 'pointer' }}>
                <EditIcon />
              </button>
            </s.EditWrapper>
          )}
        </s.ImageWrapper>

        <Typography component="h5" variant="h5">
          <a
            href={getUrl(profile?.website)}
            title={profile!.organization}
            target="_blank"
            rel="noreferrer"
          >
            {profile!.organization || ''}
          </a>
          <small>
            {profile!.tag &&
              (profile!.tag.includes('@') ? profile!.tag : `@${profile!.tag}`)}
          </small>
        </Typography>
      </s.Header>

      <s.Body>
        <Typography
          component="p"
          variant="body2"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {profile.description}
        </Typography>
        <Box pt="16px">
          {profile?.descriptionUrl && (
            <MediaPlayer url={profile?.descriptionUrl} isAudio />
          )}
        </Box>
      </s.Body>
    </s.ViewSection>
  );
};

export default ViewSection;
