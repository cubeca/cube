/**
 * `ViewSection` is a component of the Profile page that renders a profile's organization logo and allows editing if the user is logged in.
 *
 */

import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import * as s from '../Profile.styled';
import MediaPlayer from 'components/MediaPlayer';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import LanguageIcon from '@mui/icons-material/Language';
import Button from 'components/Button';
interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: any;
  loggedInProfileId: string;
  onEdit: () => void;
}

const getUrl = (website: string) => {
  return website?.startsWith('http') ? website : `https://${website}`;
};

const ViewSection: FC<ViewSectionProps> = ({
  isLoggedIn,
  profile,
  loggedInProfileId,
  onEdit
}) => {
  const isOwnProfile = loggedInProfileId === profile?.id;
  return (
    <s.ViewSection>
      <s.Header>
        <s.ImageWrapper>
          <s.ImageInner
            onClick={isLoggedIn && isOwnProfile ? onEdit : undefined}
            title={profile!.organization}
            target="_blank"
            style={{
              cursor: isLoggedIn && isOwnProfile ? 'pointer' : 'default'
            }}
            aria-label="profile image"
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
                aria-label="loading animation"
              />
            )}
          </s.ImageInner>

          {isLoggedIn && isOwnProfile && (
            <s.EditWrapper>
              <button
                onClick={onEdit}
                style={{ cursor: 'pointer' }}
                aria-label="button to go to edit profile modal"
              >
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
        </Typography>
        <small>
          <Typography
            component="p"
            variant="body2"
            style={{ margin: '0' }}
            aria-label="profile tag"
          >
            {profile!.tag &&
              (profile!.tag.includes('@') ? profile!.tag : `@${profile!.tag}`)}
          </Typography>
        </small>
        {isLoggedIn && (
          <>
            <Button
              href="https://github.com/cubeca/cube?tab=readme-ov-file#governance"
              variant="contained"
              sx={{
                backgroundColor: '#86b0af50',
                color: '#D9FFEE',
                fontSize: '12px',
                padding: '8px 16px',
                marginTop: '42px'
              }}
              aria-label="button to join Gov4CubeCommons"
            >
              Governance Tool
            </Button>
            <Typography component="p" variant="body2" sx={{ marginTop: '6px' }}>
              <small style={{ fontWeight: 500 }}>Vote. Propose. Share.</small>
            </Typography>
          </>
        )}
      </s.Header>
      <s.Body>
        <Typography
          component="p"
          variant="body2"
          style={{ whiteSpace: 'pre-wrap' }}
          aria-label="profile description"
        >
          {profile.description}
        </Typography>
        <Box pt="16px">
          {profile?.descriptionUrl && (
            <MediaPlayer
              url={profile?.descriptionUrl}
              isAudio
              aria-label="profile audio description"
            />
          )}
        </Box>
      </s.Body>
    </s.ViewSection>
  );
};

export default ViewSection;
