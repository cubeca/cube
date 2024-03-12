import React, { useEffect, useRef, useState } from 'react';
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
  const subtitleUrl = content?.vttFileUrl?.playerInfo?.publicUrl;
  const embedContentWhitelist = content?.embedContentWhitelist;

  const [isDomainAllowed, setIsDomainAllowed] = useState(true);
  const [isSuitableForChildrenModalOpen, setIsSuitableForChildrenModalOpen] =
    useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      embedContentWhitelist &&
      !(embedContentWhitelist.length === 1 && embedContentWhitelist[0] === '')
    ) {
      setIsDomainAllowed(false);
      const handleParentMessage = (event: { origin: string }) => {
        checkIsDomainAllowed(event.origin);
      };

      window.addEventListener('message', handleParentMessage);

      return () => {
        window.removeEventListener('message', handleParentMessage);
      };
    }
  }, [content, isLoading, embedContentWhitelist]);

  function checkIsDomainAllowed(domain: string) {
    if (
      embedContentWhitelist === undefined ||
      embedContentWhitelist.length === 0
    ) {
      setIsDomainAllowed(true);
    }

    const normalizedInputUrl = domain
      .replace(/(^\w+:|^)\/\//, '')
      .toLowerCase();

    const checkEmbedWhitelist = (embedContentWhitelist ?? []).some((domain) => {
      const normalizedDomain = domain
        .replace(/(^\w+:|^)\/\//, '')
        .toLowerCase();

      return (
        normalizedInputUrl === normalizedDomain ||
        normalizedInputUrl === `www.${normalizedDomain}`
      );
    });

    setIsDomainAllowed(checkEmbedWhitelist);
  }

  // if content contains a link URL, check if it's a youtube link and get the ID
  if (linkUrl) {
    youtubeID = getIDfromURL(linkUrl);
  }

  const onOver18Click = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

  const onUnder18Click = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

  const handleClose = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

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

  return isDomainAllowed ? (
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
