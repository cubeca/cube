import {
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
  Typography
} from '@mui/material';

import * as s from './MenuItem.styled';

interface MenuItemProps {
  onClick?: () => void;
  icon?: JSX.Element;
  text: string;
}

const MenuItem = ({ onClick, icon, text }: MenuItemProps) => (

  <s.Item
    onClick={onClick}
    active={onClick ? true : false}
  >
    {icon && <ListItemIcon sx={{ paddingRight: '10px' }}>{icon}</ListItemIcon>}
    <Typography component="div" sx={{ margin: 0 }}>
      {text}
    </Typography>
  </s.Item>
);

export default MenuItem;
