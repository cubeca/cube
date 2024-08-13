import {
  ListItemIcon,
  MenuItem as MuiMenuItem,
  Typography
} from '@mui/material';

interface ProfileMenuItemProps {
  onClick: () => void;
  icon: JSX.Element;
  text: string;
  clipIcon?: number;
}

const ProfileMenuItem = ({
  onClick,
  icon,
  text,
  clipIcon
}: ProfileMenuItemProps) => (
  <MuiMenuItem onClick={onClick} sx={{ marginBottom: 1, paddingX: '20px' }}>
    <ListItemIcon
      sx={{
        paddingRight: '10px',
        overflow: 'hidden',
        marginLeft: clipIcon ? `-${clipIcon}px` : '0px'
      }}
    >
      {icon}
    </ListItemIcon>
    <Typography
      variant="body2"
      component="div"
      sx={{ margin: 0, marginLeft: clipIcon ? `${clipIcon}px` : '0px' }}
    >
      {text}
    </Typography>
  </MuiMenuItem>
);

export default ProfileMenuItem;
