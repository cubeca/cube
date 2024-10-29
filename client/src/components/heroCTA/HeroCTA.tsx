import { Box, Typography } from '@mui/material';
import { ReactComponent as PlaySymbol } from 'assets/icons/play-symbol.svg';
import * as s from './HeroCTA.styled';
import ReactPlayer from 'react-player';
import { FC } from 'react';

interface HeroCtaProps {
  title: string;
  text: string;
  frenchText: string;
  video: string;
  image: string;
  subtitlesUrl: string;
}

const HeroCTA: FC<HeroCtaProps> = ({
  title,
  text,
  frenchText,
  video,
  image,
  subtitlesUrl
}) => (
  <s.CTA>
    <s.CTAContent>
      <Typography component="h2" variant="h3" sx={{ color: '#2F4048' }}>
        {title}
      </Typography>
      <Typography component="p" variant="body1" sx={{ color: '#2F4048' }}>
        {text}<span aria-label="French translation">{frenchText}</span>
      </Typography>
    </s.CTAContent>
    <s.CTAVideo aria-label="This is a video with subtitles, on how to use this page.">
      <ReactPlayer
      aria-hidden="true"
        url={video}
        width="100%"
        height="100%"
        overflow="hidden"
        playing
        controls
        config={{
          file: {
            attributes: {
              controls: true,
              crossOrigin: 'true'
            },
            forceVideo: true,
            tracks: [
              {
                src: subtitlesUrl,
                kind: 'subtitles',
                srcLang: 'en',
                default: true,
                label: 'English'
              }
            ]
          }
        }}
        playIcon={
          <Box className="play-button" role="button" aria-label="Play">
            <a href="#play-how-to-video">
              <PlaySymbol/>
            </a>
          </Box>
        }
        light={image}
      />
    </s.CTAVideo>
  </s.CTA>
);

export default HeroCTA;
