import { Stack, Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';

import FeaturedContent from './components/FeaturedContent';
import ContentFilter from './components/FeaturedContent/FeaturedContentFilter';
import CategorizedContent from './components/CategorizedContent';
import HeroPanelHome from './components/HeroPanelHome';
import Footer from 'components/layout/Footer';

const Home = () => {
  return (
    <Box>
      <HeroPanelHome />

      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <ContentFilter />
          <FeaturedContent />
          {/* <CategorizedContent /> */}
        </Grid>
      </Grid>
      
      <Footer />
    </Box>
  );
};

export default Home;
