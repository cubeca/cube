import { Typography } from '@mui/material';
import { FC } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FPOProfileUrl from 'assets/images/profile-user-image.png';
import * as s from '../Profile.styled';

interface ViewSectionProps {
  isLoggedIn: boolean;
  profile: any;
  onEdit: () => void;
}

const ViewSection: FC<ViewSectionProps> = ({ isLoggedIn, profile, onEdit }) => {
  return (
    <s.ViewSection>
      <s.Header>
        <s.ImageWrapper>
          <s.ImageInner
            href={profile.website}
            title={profile!.organization}
            target="_blank"
          >
            <img
              src={profile.logourl || FPOProfileUrl}
              alt="profile thumbnail"
            />
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
          {profile.description}
        </Typography>
      </s.Body>
    </s.ViewSection>
  );
};

export default ViewSection;
