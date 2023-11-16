import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';

import useContentDetails from 'hooks/useContentDetails';
import * as s from './EmbeddedContent.styled';

import { MediaPlayerLoader } from 'components/Loaders';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import AgeCheckModal from 'components/AgeCheckModal';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer/LinkPlayer';

const Video = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading } = useContentDetails();

  const [isSuitableForChildrenModalOpen, setIsSuitableForChildrenModalOpen] =
    useState(true);
  const youtubeID = '';

  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const bannerImage = content?.bannerImageUrl?.playerInfo?.publicUrl;
  const linkUrl = content?.externalUrl;
  const linkTitle = content?.title;
  const mediaType = content?.type;

  useEffect(() => {
    if (contentRef.current) {
      const headerHeight = document.querySelector('header')?.clientHeight || 0;
      const contentTop = contentRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: contentTop, behavior: 'auto' });
    }
  }, [contentRef.current, content]);

  useEffect(() => {
    setIsSuitableForChildrenModalOpen(content?.isSuitableForChildren === false);
  }, [content?.isSuitableForChildren]);

  function handleClose() {
    setIsSuitableForChildrenModalOpen(false);
  }

  const youtubeContent = (
    <s.VideoWrapper>
      <YouTubePlayer id={youtubeID} />
    </s.VideoWrapper>
  );

  const audioContent = (
    <s.VideoWrapper>
      <MediaPlayer url={audioUrl || ''} isAudio />
    </s.VideoWrapper>
  );

  const pdfContent = <PDFReader url={pdfUrl || ''} />;

  const videoContent = (
    <s.VideoWrapper>
      <MediaPlayer url={videoUrl || ''} />
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
      <AgeCheckModal
        isOpen={isSuitableForChildrenModalOpen}
        onClose={handleClose}
      />

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
