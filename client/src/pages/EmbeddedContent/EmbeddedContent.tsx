import { useRef } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';

import useContentDetails from 'hooks/useContentDetails';
import * as s from './EmbeddedContent.styled';

import { MediaPlayerLoader } from 'components/Loaders';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer/LinkPlayer';

const Video = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading } = useContentDetails();
  const youtubeID = '';

  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const coverArtUrl = content?.coverImageUrl?.playerInfo?.publicUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const coverImageAltText = content?.coverImageText;
  const bannerImage = content?.bannerImageUrl?.playerInfo?.publicUrl;
  const linkUrl = content?.externalUrl;
  const linkTitle = content?.title;
  const mediaType = content?.type;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const subtitleUrl = content?.vttFileUrl?.playerInfo?.publicUrl;

  const youtubeContent = (
    <s.VideoWrapper>
      <YouTubePlayer id={youtubeID} />
    </s.VideoWrapper>
  );

  const audioContent = (
    <s.AudioWrapper>
      <MediaPlayer
        url={audioUrl || ''}
        coverArtUrl={coverArtUrl}
        coverImageAltText={coverImageAltText}
        subtitleUrl={subtitleUrl}
        isSafari={isSafari}
      />
    </s.AudioWrapper>
  );

  const pdfContent = <PDFReader url={pdfUrl || ''} />;

  const videoContent = (
    <s.VideoWrapper>
      <MediaPlayer
        url={videoUrl || ''}
        coverImageAltText={coverImageAltText}
        subtitleUrl={subtitleUrl}
      />
    </s.VideoWrapper>
  );

  const linkContent = (
    <s.LinkWrapper>
      <LinkPlayer
        url={linkUrl || ''}
        cover={bannerImage || ''}
        title={linkTitle || ''}
      />
    </s.LinkWrapper>
  );

  return (
    <Box ref={contentRef}>
      <Grid container justifyContent="center">
        <Grid xs={12} md={9}>
          {isLoading ? (
            <MediaPlayerLoader type={mediaType ? mediaType : 'video'} />
          ) : youtubeID != '' ? (
            youtubeContent
          ) : content?.type === 'audio' ? (
            audioContent
          ) : content?.type === 'pdf' ? (
            pdfContent
          ) : content?.type === 'video' ? (
            videoContent
          ) : content?.type === 'link' ? (
            linkContent
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Video;
