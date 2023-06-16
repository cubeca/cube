import {
  ListItemIcon,
  MenuItem as MuiMenuItem,
  Typography
} from '@mui/material';

interface ProfileMenuItemProps {
  onClick: () => void;
  icon: JSX.Element;
  text: string;
}

const ProfileMenuItem = ({ onClick, icon, text }: ProfileMenuItemProps) => (
  <MuiMenuItem onClick={onClick}>
    <ListItemIcon>{icon}</ListItemIcon>
    <Typography component="div" sx={{ margin: 0 }}>
      {text}
    </Typography>
  </MuiMenuItem>
);

export default ProfileMenuItem;