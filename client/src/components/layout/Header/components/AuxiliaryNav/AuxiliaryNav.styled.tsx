import { styled } from 'theme/utils';
import Button from 'components/Button';

export const AuxButton = styled(Button)`
  margin: 10px 0 0 !important;
  font-weight: 500;
  color: ${(props) => props.theme.palette.primary.light};
  border-color: ${(props) => props.theme.palette.primary.dark};
  padding: 8px 24px;
`;
