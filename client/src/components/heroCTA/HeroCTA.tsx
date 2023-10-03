import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PlaySymbol } from 'assets/icons/play-symbol.svg'
import * as s from './HeroCTA.styled';
import ReactPlayer from 'react-player';
import { FC, ReactNode } from 'react';

interface HeroCtaProps {
  title: string;
  text: string;
  video: string;
  image: string;
}

const HeroCTA: FC<HeroCtaProps> = ({
  title,
  text,
  video,
  image,
}) => (
  <s.CTA>
    <s.CTAContent>
      <Typography component="h2" variant="h3" sx={{color: '#2F4048'}}>{title}</Typography>
      <Typography component="p" variant="body1" sx={{color: '#2F4048'}}>{text}</Typography>
    </s.CTAContent>
    <s.CTAVideo>
      <ReactPlayer
        url={video}
        width="100%"
        height="100%"
        overflow="hidden"
        playing
        playIcon={<Box className="play-button"><a href="#TEST"><PlaySymbol /></a></Box>}
        light={image}
      />
    </s.CTAVideo>
  </s.CTA>
);

export default HeroCTA;