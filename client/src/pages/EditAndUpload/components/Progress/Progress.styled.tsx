import { styled } from 'theme/utils';
import { alpha } from '@mui/material/styles';

export const ProgressList = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  border-bottom: 1px solid
    ${(props) => alpha(props.theme.palette.primary.dark, 0.5)};
`;

export const ProgressItem = styled('li')`
  padding: 0;
  margin: ${(props) => props.theme.spacing(3)}
    ${(props) => props.theme.spacing(2)} ${(props) => props.theme.spacing(2)};

  ${(props) => props.theme.breakpoints.up('md')} {
    margin: ${(props) => props.theme.spacing(5)}
      ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(3)};
  }

  button {
    background: none;
    border: 0;
    padding: 0;
    text-align: center;
    font-size: 14px;
    color: ${(props) =>
      props.active
        ? props.theme.palette.primary.light
        : props.theme.palette.primary.dark};
    cursor: pointer;

    &:before {
      content: '';
      display: block;
      margin: 0 auto ${(props) => props.theme.spacing(1)};
      width: ${(props) => props.theme.spacing(1.5)};
      height: ${(props) => props.theme.spacing(1.5)};
      border: 1px solid ${(props) => props.theme.palette.primary.dark};
      border-radius: ${(props) => props.theme.spacing(0.75)};
      background-color: ${(props) =>
        props.active ? props.theme.palette.primary.dark : 'transparent'};
    }

    &:hover {
      color: ${(props) => props.theme.palette.primary.light};
    }
  }
`;
