import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Social from '../Social';

const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Header />
    <Social />
    <Box component="main">{children}</Box>
    <Footer />
  </>
);

export default Main;
