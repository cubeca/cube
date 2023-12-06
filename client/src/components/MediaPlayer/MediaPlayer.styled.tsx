import ReactPlayer from 'react-player';
import { styled } from 'theme/utils';

interface StyledPlayerProps {
  coverArtUrl: string;
  coverImageAltText?: string;
}

export const StyledPlayer = styled(
  ({ coverArtUrl, coverImageAltText, ...other }: StyledPlayerProps) => (
    <ReactPlayer {...other}>
      <span role="img" aria-label={coverImageAltText}></span>
    </ReactPlayer>
  )
)`
  background-image: url('${(props) => props.coverArtUrl}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  height: 100%;
`;
