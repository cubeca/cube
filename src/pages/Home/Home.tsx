import { Stack } from '@mui/material';
import CategorizedContent from './components/CategorizedContent';
import FeaturedContent from './components/FeaturedContent';

const Home = () => {
  return (
    <Stack py="2rem" px="4rem">
      <FeaturedContent />
      <CategorizedContent />
    </Stack>
  );
};

export default Home;
