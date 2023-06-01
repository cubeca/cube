import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Kebab } from 'assets/icons/kebab.svg';
import * as s from './HamburgerMenu.styled';

const HamburgerMenu = () => {
  const { t } = useTranslation();

  return (
    <s.Hamburger>
      <Kebab />
    </s.Hamburger>
  );
};

export default HamburgerMenu;
