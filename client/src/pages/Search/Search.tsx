import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import HeroPanelHome from './components/HeroPanelHome';
import CategorizedContent from './components/CategorizedContent';
import Footer from 'components/layout/Footer';
import { useEffect, useRef } from 'react';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

const Home = () => {
  useDocumentTitle('Search Content');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('searchTerm');
  const languageSearchTerm = queryParams.get('language');

  return (
    <Box aria-label='Search Page'>
      <HeroPanelHome />
      <CategorizedContent
        tagSearchTerm={searchTerm || ''}
        languageSearchTerm={languageSearchTerm || ''}
        aria-label='search cube commons content'
      />
      <Footer />
    </Box>
  );
};

export default Home;
