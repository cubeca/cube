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
`;

export const UploadButton = styled('span')`
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;
