/**
 * `DoubleLanguagePanel` renders a two-column layout for displaying bilingual text content,
 * optionally accompanied by an image. It leverages Material-UI's Grid system for responsive layout, allowing the content to stack
 * on smaller screens and sit side-by-side on larger ones. The component supports reversing the column order, making it flexible
 * for different design needs.
 */

import Grid from '@mui/system/Unstable_Grid';
import { FC, ReactNode } from 'react';
interface DoubleLanguagePanelProps {
  textContent: ReactNode;
  frenchText: ReactNode;
  imageContent?: ReactNode;
  isReversed?: boolean;
  className?: string;
}

const DoubleLanguagePanel: FC<DoubleLanguagePanelProps> = ({
  textContent,
  frenchText,
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
      {textContent}
    </Grid>
    <Grid xs={12} md={6}>
      {frenchText}
      {imageContent}
    </Grid>
  </Grid>
);

export default DoubleLanguagePanel;
