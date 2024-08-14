/**
 * `ViewSection` is a component of the Profile page that renders a profile's organization logo and allows editing if the user is logged in.
 *
 */

import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import * as s from '../Profile.styled';
import MediaPlayer from 'components/MediaPlayer';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import LanguageIcon from '@mui/icons-material/Language';
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
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon
                style={{
                  width: '18px',
                  height: '18px',
                  color: '#d8ffed',
                  opacity: 0.9,
                  marginRight: '4px'
                }}
              />

              {profile!.organization || ''}
            </Box>
          </a>
          <small>
            <Typography component="p" variant="body2" style={{ margin: '0' }}>
              {profile!.tag &&
                (profile!.tag.includes('@')
                  ? profile!.tag
                  : `@${profile!.tag}`)}
            </Typography>
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
