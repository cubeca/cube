import { Stack } from '@mui/material';
import Footer from 'components/layout/Footer';
import AccessibilityPanel from './components/AccessibilityPanel';
import CenterColumnPanel from './components/CenterColumnPanel';
import DigitalNeighboursPanel from './components/DigitalNeighboursPanel';
import HeroPanel from './components/HeroPanel';
import VirtualExperiencesPanel from './components/VirtualExperiencesPanel';
import LanguagesPanel from './components/LanguagesPanel';

const About = () => (
  <Stack>
    <HeroPanel />
    <CenterColumnPanel />
    <VirtualExperiencesPanel />
    <AccessibilityPanel />
    <LanguagesPanel />
    <DigitalNeighboursPanel />
    <Footer />
  </Stack>
);

export default About;
