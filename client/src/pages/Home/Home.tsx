import { Stack, Box } from '@mui/material';
import Footer from 'components/layout/Footer';
import AccessibilityPanel from './components/AccessibilityPanel';
import CollaborationsPanel from './components/CollaborationsPanel';
import CenterColumnPanel from './components/CenterColumnPanel';
import DigitalNeighboursPanel from './components/DigitalNeighboursPanel';
import HeroPanel from './components/HeroPanel';
import NftsPanel from './components/NftsPanel';
import VirtualExperiencesPanel from './components/VirtualExperiencesPanel';

const About = () => (
  <Stack>
    <HeroPanel />
    <CenterColumnPanel />
    <VirtualExperiencesPanel />
    <AccessibilityPanel />
    {/* <CollaborationsPanel /> */}
    {/* <NftsPanel /> */}
    <DigitalNeighboursPanel />
    <Footer />
  </Stack>
);

export default About;
