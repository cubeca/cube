import ReactPlayer from 'react-player';
import { styled } from 'theme/utils';

interface StyledPlayerProps {
  coverArtUrl: string;
  isSafari?: boolean;
  coverImageAltText?: string;
}

export const StyledPlayer = styled(
  ({
    coverArtUrl,
    isSafari,
    coverImageAltText,
    ...other
  }: StyledPlayerProps) => (
    <ReactPlayer {...other}>
      <span role="img" aria-label={coverImageAltText}></span>
    </ReactPlayer>
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
