import { styled } from 'theme/utils';
import Panel from '../AboutPanel';
import DaoBackground from 'assets/images/dao-background.png';

export const AboutPanel = styled(Panel)`
  background: url(${DaoBackground});
  background-repeat: no-repeat;
  background-size: cover;
`;
