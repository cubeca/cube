import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';

import useContentDetails from 'hooks/useContentDetails';
import * as s from './EmbeddedContent.styled';

import { MediaPlayerLoader } from 'components/Loaders';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer/LinkPlayer';
import AgeCheckModal from 'components/AgeCheckModal';
import { getIDfromURL } from 'utils/youtubeUtils';

const Video = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading } = useContentDetails();
  let youtubeID = '';
  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const coverArtUrl = content?.coverImageUrl
    ? content?.coverImageUrl?.playerInfo?.publicUrl
    : content?.coverImageExternalUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const coverImageAltText = content?.coverImageText;
  const bannerImageAltText = content?.bannerImageText;
  const bannerImage = content?.bannerImageUrl
    ? content?.bannerImageUrl?.playerInfo?.publicUrl
    : content?.bannerImageExternalUrl;
  const linkUrl = content?.externalUrl;
  const linkTitle = content?.title;
  const mediaType = content?.type;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const subtitleUrl = content?.vttFileUrl?.playerInfo?.publicUrl;
  const embedContentWhitelist = content?.embedContentWhitelist;

  // if content contains a link URL, check if it's a youtube link and get the ID
  if (linkUrl) {
    youtubeID = getIDfromURL(linkUrl);
  }
  const [isSuitableForChildrenModalOpen, setIsSuitableForChildrenModalOpen] =
    useState(false);

  const onOver18Click = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

  const onUnder18Click = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

  useEffect(() => {
    if (content?.isSuitableForChildren === false) {
      setIsSuitableForChildrenModalOpen(true);
    }
  }, [content?.isSuitableForChildren]);

  function handleClose() {
    setIsSuitableForChildrenModalOpen(false);
  }

  function isDomainAllowed(domain: string) {
    console.log(domain, embedContentWhitelist);
    if (
      embedContentWhitelist === undefined ||
      embedContentWhitelist.length === 0
    ) {
      return true;
    }

    return embedContentWhitelist.includes(domain);
  }

  useEffect(() => {
    console.log('i am in thie effect');
    const handleParentMessage = (event: { origin: string }) => {
      console.log('Received message from parent:', event.origin);
      if (embedContentWhitelist) {
        console.log('i am here');
        if (embedContentWhitelist.includes(event.origin)) {
          console.log(`Received message from allowed domain: ${event.origin}`);
          // Handle the message from the allowed domain
        } else {
          console.log(
            `Received message from disallowed domain: ${event.origin}`
          );
          // Handle the message from the disallowed domain
        }
      }
    };

    window.addEventListener('message', handleParentMessage);

    return () => {
      window.removeEventListener('message', handleParentMessage);
    };
  }, []);

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
        coverImageAltText={coverImageAltText}
        bannerImageAltText={bannerImageAltText}
      />
    </s.LinkWrapper>
  );

  return isDomainAllowed('') ? (
    <Box ref={contentRef}>
      <AgeCheckModal
        isOpen={isSuitableForChildrenModalOpen}
        onClose={handleClose}
        onOver18Click={onOver18Click}
        onUnder18Click={onUnder18Click}
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
  ) : (
    <Box>
      <h1>This content is not allowed to be embedded.</h1>
    </Box>
  );
};

export default Video;
