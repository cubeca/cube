import { Stack, Box } from '@mui/material';
import Footer from 'components/layout/Footer';
import AccessibilityPanel from './components/AccessibilityPanel';
import CollaborationsPanel from './components/CollaborationsPanel';
import CreatorsPanel from './components/CreatorsPanel';
import DaoPanel from './components/DaoPanel';
import DigitalNeighboursPanel from './components/DigitalNeighboursPanel';
import HeroPanel from './components/HeroPanel';
import NftsPanel from './components/NftsPanel';
import VirtualExperiencesPanel from './components/VirtualExperiencesPanel';

const About = () => (
  <Stack sx={{position: 'absolute', top: '0', bottom: '0'}}>
    <Box sx={{background: '#28343C'}}>
    <HeroPanel />
    <DaoPanel />
    <CreatorsPanel />
    <AccessibilityPanel />
    <VirtualExperiencesPanel />
    {/* <CollaborationsPanel /> */}
    {/* <NftsPanel /> */}
    <DigitalNeighboursPanel />
    <Footer />
    </Box>
  </Stack>
);

export default About;
