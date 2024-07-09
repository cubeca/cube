import { styled } from 'theme/utils';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
const getImage = (props: any) => {
  if (props.editMode && props.newImage !== undefined) {
    return `url('${props.newImage}')`;
  } else if (props.editMode && props.currentImage !== '') {
    return `url('${props.currentImage}')`;
  }
};
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
    background-image: ${(props) =>
      props.isUploadReady || props.isUploadComplete
        ? 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDNDOC4zNzMgMyAzIDguMzczIDMgMTVDMyAyMS42MjcgOC4zNzMgMjcgMTUgMjdDMjEuNjI3IDI3IDI3IDIxLjYyNyAyNyAxNUMyNyAxMi44MjA2IDI2LjQxIDEwLjc4MzEgMjUuMzk0NSA5LjAyMTQ4TDE0LjE0NjUgMjAuMjY3NkMxMy45NTk1IDIwLjQ1NDYgMTMuNzA1NSAyMC41NjA1IDEzLjQzOTUgMjAuNTYwNUMxMy4xNzQ1IDIwLjU2MDUgMTIuOTE5NCAyMC40NTU2IDEyLjczMjQgMjAuMjY3Nkw4LjI3OTMgMTUuODE0NUM3Ljg4ODMgMTUuNDIzNSA3Ljg4ODMgMTQuNzkxNCA4LjI3OTMgMTQuNDAwNEM4LjY3MDMgMTQuMDA5NCA5LjMwMjM2IDE0LjAwOTQgOS42OTMzNiAxNC40MDA0TDEzLjQzOTUgMTguMTQ2NUwyNC4yNDAyIDcuMzQ1N0MyMi4wMzkyIDQuNjkwNyAxOC43MTggMyAxNSAzWk0yNC4yNDAyIDcuMzQ1N0MyNC42NzE5IDcuODY2MjggMjUuMDUzNyA4LjQzMDA1IDI1LjM5NDUgOS4wMTk1M0wyNy43MDcgNi43MDcwM0MyOC4wOTggNi4zMTUwMyAyOC4wOTggNS42ODM5NyAyNy43MDcgNS4yOTI5N0MyNy4zMTYgNC45MDE5NyAyNi42ODQgNC45MDE5NyAyNi4yOTMgNS4yOTI5N0wyNC4yNDAyIDcuMzQ1N1oiIGZpbGw9IiNEOUZGRUUiLz4KPC9zdmc+Cg==")'
        : 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDZDOS43OSA2IDggNy43OSA4IDEwVjQ0QzggNDYuMjEgOS43OSA0OCAxMiA0OEgyOFYyMi44MjgxTDIzLjQxNDEgMjcuNDE0MUMyMi42MzIxIDI4LjE5NjEgMjEuMzY3OSAyOC4xOTYxIDIwLjU4NTkgMjcuNDE0MUMxOS44MDM5IDI2LjYzMjEgMTkuODAzOSAyNS4zNjc5IDIwLjU4NTkgMjQuNTg1OUwyOC41ODU5IDE2LjU4NTlDMjguOTc1OSAxNi4xOTU5IDI5LjQ4OCAxNiAzMCAxNkMzMC41MTIgMTYgMzEuMDI0MSAxNi4xOTU5IDMxLjQxNDEgMTYuNTg1OUwzOS40MTQxIDI0LjU4NTlDNDAuMTk2MSAyNS4zNjc5IDQwLjE5NjEgMjYuNjMyMSAzOS40MTQxIDI3LjQxNDFDMzguNjMyMSAyOC4xOTYxIDM3LjM2NzkgMjguMTk2MSAzNi41ODU5IDI3LjQxNDFMMzIgMjIuODI4MVY0OEg0OEM1MC4yMSA0OCA1MiA0Ni4yMSA1MiA0NFYxMEM1MiA3Ljc5IDUwLjIxIDYgNDggNkgxMlpNMzIgNDhIMjhWNTZDMjggNTcuMTA0IDI4Ljg5NiA1OCAzMCA1OEMzMS4xMDQgNTggMzIgNTcuMTA0IDMyIDU2VjQ4WiIgZmlsbD0iI0Q5RkZFRSIvPgo8L3N2Zz4K")'};
  }

  &.dark {
    border-color: ${({ theme }) => alpha(theme.palette.secondary.main, 0.25)};
    background: ${({ theme }) => alpha(theme.palette.secondary.main, 0.125)};
    color: ${({ theme }) => theme.palette.secondary.main};

    &::before {
      background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30' width='30px' height='30px'%3E%3Cpath d='M 6 3 C 4.895 3 4 3.895 4 5 L 4 22 C 4 23.105 4.895 24 6 24 L 14 24 L 14 11.414062 L 11.707031 13.707031 C 11.316031 14.098031 10.683969 14.098031 10.292969 13.707031 C 9.9019687 13.316031 9.9019687 12.683969 10.292969 12.292969 L 14.292969 8.2929688 C 14.487969 8.0979687 14.744 8 15 8 C 15.256 8 15.512031 8.0979688 15.707031 8.2929688 L 19.707031 12.292969 C 20.098031 12.683969 20.098031 13.316031 19.707031 13.707031 C 19.316031 14.098031 18.683969 14.098031 18.292969 13.707031 L 16 11.414062 L 16 24 L 24 24 C 25.105 24 26 23.105 26 22 L 26 5 C 26 3.895 25.105 3 24 3 L 6 3 z M 16 24 L 14 24 L 14 28 C 14 28.552 14.448 29 15 29 C 15.552 29 16 28.552 16 28 L 16 24 z'/%3E%3C/svg%3E");

      background-image: ${(props) =>
        props.isUploadReady || props.isUploadComplete
          ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgMzAgMzAiIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiPiAgICA8cGF0aCBkPSJNIDE1IDMgQyA4LjM3MyAzIDMgOC4zNzMgMyAxNSBDIDMgMjEuNjI3IDguMzczIDI3IDE1IDI3IEMgMjEuNjI3IDI3IDI3IDIxLjYyNyAyNyAxNSBDIDI3IDEyLjgyMDYyMyAyNi40MDk5OTcgMTAuNzgzMTM4IDI1LjM5NDUzMSA5LjAyMTQ4NDQgTCAxNC4xNDY0ODQgMjAuMjY3NTc4IEMgMTMuOTU5NDg0IDIwLjQ1NDU3OCAxMy43MDU0NTMgMjAuNTYwNTQ3IDEzLjQzOTQ1MyAyMC41NjA1NDcgQyAxMy4xNzQ0NTMgMjAuNTYwNTQ3IDEyLjkxOTQyMiAyMC40NTU1NzggMTIuNzMyNDIyIDIwLjI2NzU3OCBMIDguMjc5Mjk2OSAxNS44MTQ0NTMgQyA3Ljg4ODI5NjkgMTUuNDIzNDUzIDcuODg4Mjk2OSAxNC43OTEzOTEgOC4yNzkyOTY5IDE0LjQwMDM5MSBDIDguNjcwMjk2OSAxNC4wMDkzOTEgOS4zMDIzNTk0IDE0LjAwOTM5MSA5LjY5MzM1OTQgMTQuNDAwMzkxIEwgMTMuNDM5NDUzIDE4LjE0NjQ4NCBMIDI0LjI0MDIzNCA3LjM0NTcwMzEgQyAyMi4wMzkyMzQgNC42OTA3MDMxIDE4LjcxOCAzIDE1IDMgeiBNIDI0LjI0MDIzNCA3LjM0NTcwMzEgQyAyNC42NzE4ODQgNy44NjYyODA4IDI1LjA1Mzc0MyA4LjQzMDA1MTYgMjUuMzk0NTMxIDkuMDE5NTMxMiBMIDI3LjcwNzAzMSA2LjcwNzAzMTIgQyAyOC4wOTgwMzEgNi4zMTUwMzEyIDI4LjA5ODAzMSA1LjY4Mzk2ODggMjcuNzA3MDMxIDUuMjkyOTY4OCBDIDI3LjMxNjAzMSA0LjkwMTk2ODcgMjYuNjgzOTY5IDQuOTAxOTY4OCAyNi4yOTI5NjkgNS4yOTI5Njg4IEwgMjQuMjQwMjM0IDcuMzQ1NzAzMSB6Ii8+PC9zdmc+")'
          : 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDZDOS43OSA2IDggNy43OSA4IDEwVjQ0QzggNDYuMjEgOS43OSA0OCAxMiA0OEgyOFYyMi44MjgxTDIzLjQxNDEgMjcuNDE0MUMyMi42MzIxIDI4LjE5NjEgMjEuMzY3OSAyOC4xOTYxIDIwLjU4NTkgMjcuNDE0MUMxOS44MDM5IDI2LjYzMjEgMTkuODAzOSAyNS4zNjc5IDIwLjU4NTkgMjQuNTg1OUwyOC41ODU5IDE2LjU4NTlDMjguOTc1OSAxNi4xOTU5IDI5LjQ4OCAxNiAzMCAxNkMzMC41MTIgMTYgMzEuMDI0MSAxNi4xOTU5IDMxLjQxNDEgMTYuNTg1OUwzOS40MTQxIDI0LjU4NTlDNDAuMTk2MSAyNS4zNjc5IDQwLjE5NjEgMjYuNjMyMSAzOS40MTQxIDI3LjQxNDFDMzguNjMyMSAyOC4xOTYxIDM3LjM2NzkgMjguMTk2MSAzNi41ODU5IDI3LjQxNDFMMzIgMjIuODI4MVY0OEg0OEM1MC4yMSA0OCA1MiA0Ni4yMSA1MiA0NFYxMEM1MiA3Ljc5IDUwLjIxIDYgNDggNkgxMlpNMzIgNDhIMjhWNTZDMjggNTcuMTA0IDI4Ljg5NiA1OCAzMCA1OEMzMS4xMDQgNTggMzIgNTcuMTA0IDMyIDU2VjQ4WiIgZmlsbD0iIzI4MzQzQyIvPgo8L3N2Zz4K")'};
    }
  }
`;

export const UploadButton = styled('span')`
  text-decoration: underline;
  cursor: pointer;
`;

export const CurrentImageBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 180px;
  width: 100%;
  transform: translate(-50%, -50%);
  z-index: -1;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => alpha(theme.palette.secondary.main, 0.5)};
    z-index: 1;
    overflow: hidden;
  }
`;
export const NewImageBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 20px;
`;
export const CurrentImage = styled(Box)`
  background-image: ${(props) => getImage(props)};
  height: 180px;
  width: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
`;
export const NewImage = styled(Box)`
  background-image: ${(props) => `url(${props.newImage})`};
  height: 150px;
  width: 150px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  border-radius: 5px;
`;
