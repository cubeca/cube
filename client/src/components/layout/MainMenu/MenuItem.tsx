import {
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
  Typography
} from '@mui/material';

interface MenuItemProps {
  onClick: () => void;
  icon: JSX.Element;
  text: string;
}

const MenuItem = ({ onClick, icon, text }: MenuItemProps) => (
  <MuiMenuItem onClick={onClick}>
    <ListItemIcon>{icon}</ListItemIcon>
    <Typography component="div" sx={{ margin: 0 }}>
      {text}
    </Typography>
  </MuiMenuItem>
);

export default MenuItem;
