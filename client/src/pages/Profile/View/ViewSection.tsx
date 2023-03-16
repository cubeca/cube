import { Box, Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import MediaPlayer from 'components/MediaPlayer';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from 'api/profile';
import EditIcon from '@mui/icons-material/Edit';
import FPOProfileUrl from 'assets/images/profile-user-image.png';
import * as s from './ViewSection.styled';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: any;
  onEdit: () => void;
}

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  const { t } = useTranslation();
  return (
    <s.ViewSection>
      <s.Header>
        <s.ImageWrapper>
          <s.ImageInner>
            <img src={FPOProfileUrl} alt="profile thumbnail" />
          </s.ImageInner>
          {isLoggedIn && (
            <s.EditWrapper>
              <button onClick={onEdit}>
                <EditIcon />
              </button>
            </s.EditWrapper>
          )}
        </s.ImageWrapper>

        <Typography component="h5" variant="h5">
          {profile!.organization}
          <small>
            <a href="https://www.example.com/" title="visit MOA website">
              @MOA
            </a>
          </small>
        </Typography>
      </s.Header>

      <s.Body>
        <Typography component="p" variant="body2">
          {profile.description}
        </Typography>
      </s.Body>
    </s.ViewSection>
  );
};

export default ViewSection;
