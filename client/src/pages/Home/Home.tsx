import { Stack, Box, Grid } from '@mui/material';
import CategorizedContent from './components/CategorizedContent';
import FeaturedContent from './components/FeaturedContent';
import HeroPanelHome from './components/HeroPanelHome';
import ContentByMedium from './components/ContentByMedium/index'
import Footer from 'components/layout/Footer';

const Home = () => {
  return (
    <Grid container>
    <Stack sx={{position: 'absolute', top: '0', bottom: '0'}}>
      <HeroPanelHome />
      <Grid item>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', pl: '4rem', pt: { xs: '0', md: '10rem' }, backgroundImage: 'linear-gradient(rgba(40,52,60,0),rgba(40,52,60,0.6), rgba(40,52,60,0.8), rgba(40,52,60,1),rgba(40,52,60,1), rgba(40,52,60,1))', pb: '2rem', width: '100vw'}}>
    <ContentByMedium />
    </Box>
    </Grid>
    <Grid item>
    <Stack sx={{py: '2rem', px: '4rem', background: 'rgba(40,52,60,1)'}}>
      <FeaturedContent />
      <CategorizedContent />
    </Stack>
    </Grid>
    <Box sx={{p: '2rem'}}>
    <Footer />
    </Box>
    </Stack>
    </Grid>
  );
};

export default Home;
