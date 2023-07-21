import { Stack, Box, Grid } from '@mui/material';
import CategorizedContent from './components/CategorizedContent';
import FeaturedContent from './components/FeaturedContent';
import HeroPanelHome from './components/HeroPanelHome';
import ContentByMedium from '../Profile/ContentByMedium/index'
import Footer from 'components/layout/Footer';

const Home = () => {
  return (
    <Stack>
      <HeroPanelHome />

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', pl: '4rem', pt: { xs: '0', md: '10rem' }, backgroundImage: 'linear-gradient(rgba(40,52,60,0),rgba(40,52,60,0.6), rgba(40,52,60,0.8), rgba(40,52,60,1),rgba(40,52,60,1), rgba(40,52,60,1))', pb: '2rem', width: '100vw'}}>
        <ContentByMedium />
      </Box>

      <Stack sx={{py: '2rem', px: '4rem', background: 'rgba(40,52,60,1)'}}>
        <FeaturedContent />
        <CategorizedContent />
      </Stack>

      <Footer />
    </Stack>
  );
};

export default Home;
