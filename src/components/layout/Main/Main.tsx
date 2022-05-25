import { Box } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';

const Main: FC<{ children: ReactNode }> = ({ children }) => (
    <>
        <Header />
        <Box component="main">{children}</Box>
        <Footer />
    </>
);

export default Main;
