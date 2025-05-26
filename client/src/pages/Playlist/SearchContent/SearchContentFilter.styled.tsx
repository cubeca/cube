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
          border-bottom: 1px solid black;
        }

        input {
          padding: 8px 0;
          font-size: 24px;
          color: black;

          ${(props) => props.theme.breakpoints.up('md')} {
            font-size: 22px;
          }

          &::placeholder {
            color: black !important;
            opacity: 1;
          }
        }

        .MuiInput-input {
          color: black !important;
        }

        .MuiInputBase-input {
          color: black !important;
          &::placeholder {
            color: black !important;
            opacity: 1;
          }
        }
      }
    }
  }

  .typeFilter {
    color: black !important;

    .MuiInputBase-root {
      border: 2px solid rgba(0, 0, 0, 0.7) !important;
      transition: all 0.2s ease;
      color: black !important;

      &:hover {
        border: 3px solid rgba(0, 0, 0, 0.8) !important;
      }

      &:focus-within {
        border: 3px solid black !important;
        outline: 2px solid black;
        outline-offset: 2px;
      }
      .MuiSelect-select {
        color: black !important;
      }
    }

    .MuiFormLabel-root {
      top: -15px;
      color: black !important;
    }

    .MuiInputBase-root,
    .MuiFormLabel-root {
      margin-bottom: 0 !important;
      color: black !important;
    
    }

    .MuiMenuItem-root {
      background-color: black !important;
    }
    .MuiMenu-paper {
      background-color: black !important;
    }
    & .MuiSvgIcon-root {
      fill: black !important;
    }
    & .MuiOutlinedInput-notchedOutline {
      border: none;
    }
    & .Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: 'rgba(228, 219, 233, 0.25)';
      color: black;
    }
    :hover .MuiOutlinedInput-notchedOutline {
      border-color: 'rgba(228, 219, 233, 0.25)';
    }
  }
`;
