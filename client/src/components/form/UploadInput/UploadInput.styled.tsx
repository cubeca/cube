import { styled } from 'theme/utils';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const UploadBox = styled(Box)`
  position: relative;
  text-align: center;
  padding: 7rem 2rem 2rem;
  border: 2px dashed ${({ theme }) => alpha(theme.palette.primary.light, 0.125)};
  border-radius: 5px;
  background: ${({ theme }) => alpha(theme.palette.primary.light, 0.065)};
  color: ${({ theme }) => theme.palette.primary.light};

  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 2rem;
    left: calc(50% - 30px);
    width: 60px;
    height: 60px;
    background: no-repeat center/contain;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDZDOS43OSA2IDggNy43OSA4IDEwVjQ0QzggNDYuMjEgOS43OSA0OCAxMiA0OEgyOFYyMi44MjgxTDIzLjQxNDEgMjcuNDE0MUMyMi42MzIxIDI4LjE5NjEgMjEuMzY3OSAyOC4xOTYxIDIwLjU4NTkgMjcuNDE0MUMxOS44MDM5IDI2LjYzMjEgMTkuODAzOSAyNS4zNjc5IDIwLjU4NTkgMjQuNTg1OUwyOC41ODU5IDE2LjU4NTlDMjguOTc1OSAxNi4xOTU5IDI5LjQ4OCAxNiAzMCAxNkMzMC41MTIgMTYgMzEuMDI0MSAxNi4xOTU5IDMxLjQxNDEgMTYuNTg1OUwzOS40MTQxIDI0LjU4NTlDNDAuMTk2MSAyNS4zNjc5IDQwLjE5NjEgMjYuNjMyMSAzOS40MTQxIDI3LjQxNDFDMzguNjMyMSAyOC4xOTYxIDM3LjM2NzkgMjguMTk2MSAzNi41ODU5IDI3LjQxNDFMMzIgMjIuODI4MVY0OEg0OEM1MC4yMSA0OCA1MiA0Ni4yMSA1MiA0NFYxMEM1MiA3Ljc5IDUwLjIxIDYgNDggNkgxMlpNMzIgNDhIMjhWNTZDMjggNTcuMTA0IDI4Ljg5NiA1OCAzMCA1OEMzMS4xMDQgNTggMzIgNTcuMTA0IDMyIDU2VjQ4WiIgZmlsbD0iIzk1RjVDQiIvPgo8L3N2Zz4K');
  }

  &.dark {
    border-color: ${({ theme }) => alpha(theme.palette.secondary.main, 0.25)};
    background: ${({ theme }) => alpha(theme.palette.secondary.main, 0.125)};
    color: ${({ theme }) => theme.palette.secondary.main};

    &::before {
      background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30' width='30px' height='30px'%3E%3Cpath d='M 6 3 C 4.895 3 4 3.895 4 5 L 4 22 C 4 23.105 4.895 24 6 24 L 14 24 L 14 11.414062 L 11.707031 13.707031 C 11.316031 14.098031 10.683969 14.098031 10.292969 13.707031 C 9.9019687 13.316031 9.9019687 12.683969 10.292969 12.292969 L 14.292969 8.2929688 C 14.487969 8.0979687 14.744 8 15 8 C 15.256 8 15.512031 8.0979688 15.707031 8.2929688 L 19.707031 12.292969 C 20.098031 12.683969 20.098031 13.316031 19.707031 13.707031 C 19.316031 14.098031 18.683969 14.098031 18.292969 13.707031 L 16 11.414062 L 16 24 L 24 24 C 25.105 24 26 23.105 26 22 L 26 5 C 26 3.895 25.105 3 24 3 L 6 3 z M 16 24 L 14 24 L 14 28 C 14 28.552 14.448 29 15 29 C 15.552 29 16 28.552 16 28 L 16 24 z'/%3E%3C/svg%3E");
    }
  }
`;

export const UploadButton = styled('span')`
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;
