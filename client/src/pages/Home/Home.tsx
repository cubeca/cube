import { Stack } from '@mui/material';
import CategorizedVideos from './components/CategorizedVideos';
import FeaturedVideos from './components/FeaturedVideos';

const Home = () => {
  return (
    <Stack py="2rem" px="4rem">
      <FeaturedVideos />
      <CategorizedVideos />
    </Stack>
  );
};

export default Home;
