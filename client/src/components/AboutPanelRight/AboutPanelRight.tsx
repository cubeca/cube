import { Grid } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AboutPanelProps {
  textContent: ReactNode;
  imageContent?: ReactNode;
  isReversed?: boolean;
  className?: string;
}

const AboutPanelRight: FC<AboutPanelProps> = ({
  textContent,
  imageContent,
  className,
  isReversed
}) => (
  <Grid
    container
    spacing={0}
    columnGap="none"
    className={className}
    direction={isReversed ? 'row-reverse' : 'row'}
    xs={12} md={12}
    flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
    order={{xs: 'reverse'}}
  >
    <Grid item xs={12} md={6} justifyContent={{xs: 'center'}}>
      {textContent}
    </Grid>
    <Grid item xs={12} md={6}>
      {imageContent}
    </Grid>
  </Grid>
);

export default AboutPanelRight;
