import { Box, Stack } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AboutPanelProps {
  textContent: ReactNode;
  imageContent: ReactNode;
  isReversed?: boolean;
}

const AboutPanel: FC<AboutPanelProps> = ({
  textContent,
  imageContent,
  isReversed
}) => (
  <Stack
    direction={isReversed ? 'row-reverse' : 'row'}
    spacing={4}
    justifyContent="center"
    py="2rem"
  >
    <Box>{textContent}</Box>
    <Box>{imageContent}</Box>
  </Stack>
);

export default AboutPanel;
