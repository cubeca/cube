import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import HeroPanelHome from './components/HeroPanelHome';
import CategorizedContent from './components/CategorizedContent';
import Footer from 'components/layout/Footer';
import { useEffect, useRef } from 'react';

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('searchTerm');
  const languageSearchTerm = queryParams.get('language');

  return (
    <Box>
      <HeroPanelHome />
      <CategorizedContent
        tagSearchTerm={searchTerm || ''}
        languageSearchTerm={languageSearchTerm || ''}
      />
      <Footer />
    </Box>
  );
};

export default Home;
