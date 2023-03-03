import { styled } from 'theme/utils';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';

export const BreadcrumbWrapper = styled(Box)`
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.background.paper};
`;

export const Breadcrumb = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;

  li:not(:last-child)::after {
    content: '';
    display: inline-block;
    margin: 0 ${({ theme }) => theme.spacing(2)};
    width: 7px;
    height: 12px;
    background: no-repeat center/contain;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDcgMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yLjAwMDI4IDEySDEuMDAwMjhDMC44MDcyODQgMTIgMC42MzEyODQgMTEuODg4NSAwLjU0ODI4NCAxMS43MTRDMC40NjUyODQgMTEuNTM5NSAwLjQ5MDc4NCAxMS4zMzMgMC42MTMyODQgMTEuMTgzTDQuODU0MjggNkwwLjYxMzI4NCAwLjgxNjVDMC40OTA3ODQgMC42NjcgMC40NjU3ODQgMC40NjA1IDAuNTQ4Mjg0IDAuMjg1NUMwLjYzMDc4NCAwLjExMDUgMC44MDcyODQgMCAxLjAwMDI4IDBIMi4wMDAyOEMyLjE1MDI4IDAgMi4yOTIyOCAwLjA2NzUwMDEgMi4zODcyOCAwLjE4MzVMNi44ODcyOCA1LjY4MzVDNy4wMzc3OCA1Ljg2OCA3LjAzNzc4IDYuMTMyNSA2Ljg4NzI4IDYuMzE3TDIuMzg3MjggMTEuODE3QzIuMjkyMjggMTEuOTMyNSAyLjE1MDI4IDEyIDIuMDAwMjggMTJaIiBmaWxsPSIjOTVGNUNCIi8+Cjwvc3ZnPgo=');
  }

  button {
    padding: ${({ theme }) => theme.spacing(1)}
      ${({ theme }) => theme.spacing(2)};

    &.MuiButton-text {
      font-weight: normal;
      color: ${({ theme }) => theme.palette.primary.light};
    }
  }
`;
