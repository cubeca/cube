import { Box } from '@mui/material';
import HeroPanelHome from './components/HeroPanelHome';
import CategorizedContent from './components/CategorizedContent';
import Footer from 'components/layout/Footer';

const Home = () => {
  return (
    <Box>
      <HeroPanelHome />
      <CategorizedContent />
      <Footer />
    </Box>
  );
};

export default Home;
