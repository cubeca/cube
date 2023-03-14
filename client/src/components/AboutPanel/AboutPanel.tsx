import Grid from '@mui/system/Unstable_Grid';
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
    className={className}
    flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
    direction={isReversed ? 'row-reverse' : 'row'}
  >
    <Grid xs={12} md={6}>
      {imageContent}
    </Grid>
    <Grid xs={12} md={6}>
      {textContent}
    </Grid>
  </Grid>
);

export default AboutPanel;
