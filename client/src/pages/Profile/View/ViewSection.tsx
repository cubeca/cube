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
          <s.ImageInner href={profile.website} title={profile!.organization}>
            <img src={FPOProfileUrl} alt="profile thumbnail" />
          </s.ImageInner>
          {isLoggedIn && (
            <s.EditWrapper>
              {/* <button onClick={onEdit}> */}
              <button>
                <EditIcon />
              </button>
            </s.EditWrapper>
          )}
        </s.ImageWrapper>

        <Typography component="h5" variant="h5">
          <a href={profile.website} title={profile!.organization}>
            {profile!.organization}
          </a>
          <small>
            {/* <a href="/home" title={profile!.tag}> */}
            {profile!.tag}
            {/* </a> */}
          </small>
        </Typography>
      </s.Header>

      <s.Body>
        <Typography component="p" variant="body2">
          {/* {profile.description} */}
          You have successfully created your profile on CubeCommons! In the next
          week we will send you an email update when your profile is confirmed
          and you can start editing this profile description. You can already
          start uploading content which will appear when your profile is
          confirmed. All content players will be embeddable on your website
          which we have linked to your username.
        </Typography>
      </s.Body>
    </s.ViewSection>
  );
};

export default ViewSection;
