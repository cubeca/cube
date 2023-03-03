import { styled } from 'theme/utils';
import { Box } from '@mui/system';
import { alpha } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const FormFooter = styled(Box)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid
    ${(props) => alpha(props.theme.palette.primary.dark, 0.5)};
`;

export const Messages = styled(Box)`
  padding: 1rem 0;
  text-align: center;
`;

export const SuccessMessage = styled(Typography)`
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
    background: transparent no-repeat center/contain;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40ODYgMiAyIDYuNDg2IDIgMTJDMiAxNy41MTQgNi40ODYgMjIgMTIgMjJDMTcuNTE0IDIyIDIyIDE3LjUxNCAyMiAxMkMyMiAxMC44NzQgMjEuODA0IDkuNzk0MiAyMS40NTkgOC43ODMyTDE5LjgzOTggMTAuNDAyM0MxOS45NDQ4IDEwLjkxODMgMjAgMTEuNDUzIDIwIDEyQzIwIDE2LjQxMSAxNi40MTEgMjAgMTIgMjBDNy41ODkgMjAgNCAxNi40MTEgNCAxMkM0IDcuNTg5IDcuNTg5IDQgMTIgNEMxMy42MzMgNCAxNS4xNTE5IDQuNDkzODkgMTYuNDE5OSA1LjMzNzg5TDE3Ljg1MTYgMy45MDYyNUMxNi4yMDM2IDIuNzEyMjUgMTQuMTg1IDIgMTIgMlpNMjEuMjkzIDMuMjkyOTdMMTEgMTMuNTg1OUw3LjcwNzAzIDEwLjI5M0w2LjI5Mjk3IDExLjcwN0wxMSAxNi40MTQxTDIyLjcwNyA0LjcwNzAzTDIxLjI5MyAzLjI5Mjk3WiIgZmlsbD0iIzk1RjVDQiIvPgo8L3N2Zz4K');
  }
`;

export const Actions = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  button {
    margin: 1rem;
  }
`;
