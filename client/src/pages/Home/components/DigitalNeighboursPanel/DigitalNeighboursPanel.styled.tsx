import { Stack, Card } from '@mui/material';
import { styled } from 'theme/utils';
import { Link as RouterLink } from 'react-router-dom';

export const DigitalNeighboursPanel = styled(Stack)`
  padding: 0 8.333333333333333% 24px;
  text-align: center;
  align-items: center;

  ${(props) => props.theme.breakpoints.up('xs')} {

    padding: 20vw 0 8.333333333333334vw 0;
    
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 10vw 8.333333333333333% 10px;
  }
  h2{
    margin-bottom: 3px;
    margin-top: 4vw;
  }
  h3{
    margin-bottom: 2rem;
  }
  p{
    margin-bottom: 0;
  }
`;

export const NeighbourCard = styled(Card)`
  flex: 0 0 100%;
  margin-bottom: 16px;
  text-align: center;
  padding: 45px 30px 30px;
  box-shadow: none;
  border-radius: 0;
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.primary.light};

  ${(props) => props.theme.breakpoints.up('md')} {
    flex: 0 0 calc(25% - 16px);
    margin: 8px;
  }

  h6 {
    margin-bottom: 16px;
  }
`;

export const ExternalLinkText = styled(RouterLink)`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: underline;
  line-height: inherit;
  padding: 1rem 0;
`;
