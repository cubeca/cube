import { Grid } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AboutPanelProps {
  textContent: ReactNode;
  imageContent?: ReactNode;
  isReversed?: boolean;
  className?: string;
}

const AboutPanel: FC<AboutPanelProps> = ({
  textContent,
  imageContent,
  className,
  isReversed
}) => (
  <Grid
    container
    spacing={6}
    py="5rem"
    className={className}
    direction={isReversed ? 'row-reverse' : 'row'}
  >
    <Grid item xs={6}>
      {textContent}
    </Grid>
    <Grid item xs={6}>
      {imageContent}
    </Grid>
  </Grid>
);

export default AboutPanel;
