import { Stack } from '@mui/material';
import CategorizedVideos from './components/CategorizedVideos';
import FilteredVideos from './components/FilteredVideos';

const Home = () => {
  return (
    <Stack py="2rem" px="4rem">
      <FilteredVideos />
      <CategorizedVideos />
    </Stack>
  );
};

export default Home;
