import { Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Filters = styled(Stack)`
  margin-bottom: 32px;

  display: flex;
  flex-flow: column nowrap;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-bottom: 16px;
    flex-flow: row nowrap;
    gap: 20px;
  }

  > form {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;

    ${(props) => props.theme.breakpoints.up('md')} {
      margin-bottom: 16px;
      flex-flow: row nowrap;
      gap: 20px;
    }
  }

  .searchFilter {
    width: 100%;

    > .MuiBox-root > * {
      display: none;
    }

    .MuiInputBase-root {
      width: 100%;

      input {
        width: 100%;
      }
    }

    > .MuiBox-root > *.MuiFormControl-root,
    > .MuiBox-root > *.MuiFormControl-root .MuiFormControl-root {
      display: block;

      .MuiInput-underline {
        &:before {
          border-bottom: 1px solid
            ${(props) => props.theme.palette.primary.main};
        }

        input {
          padding: 8px 0;
          font-size: 24px;
          color: ${(props) => props.theme.palette.primary.main};

          ${(props) => props.theme.breakpoints.up('md')} {
            font-size: 32px;
          }

          &::placeholder {
            opacity: 1;
          }
        }
      }
    }
  }

  .typeFilter {
    .MuiInputBase-root,
    .MuiFormLabel-root {
      margin-bottom: 0 !important;
    }
  }
`;
