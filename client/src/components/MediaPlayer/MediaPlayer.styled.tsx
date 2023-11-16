import ReactPlayer from 'react-player';
import { styled } from 'theme/utils';

interface StyledPlayerProps {
  coverArtUrl: string;
  isSafari?: boolean;
}

export const StyledPlayer = styled(
  ({ coverArtUrl, isSafari, ...other }: StyledPlayerProps) => (
    <ReactPlayer {...other} />
  )
)`
  background-image: ${(props) =>
    props.isSafari ? `url('${props.coverArtUrl}')` : 'none'};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  height: 100%;
`;
