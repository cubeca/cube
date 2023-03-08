import { Box, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Social from '../Header/components/Social';

const Main: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  
  return (
  <Box>
    <Header/>
    {/* <Social /> */}
    <Box component="main">{children}</Box>
    {/* <Footer/> */}
  </Box>
)};

export default Main;
