import React, { useEffect, useRef, useState } from 'react';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Stack, Typography, useTheme, Box, Link } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import CodeIcon from '@mui/icons-material/Code';

import useContentDetails from 'hooks/useContentDetails';

import MoreContent from './MoreContent';
import Contributors from './Contributors';

import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';
import Footer from 'components/layout/Footer';
import * as s from './Content.styled';
import { CollaboratorDetails, Contributor } from 'types/content';
import AgeCheckModal from 'components/AgeCheckModal';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer/LinkPlayer';
import { OVER_18 } from 'constants/localStorage';
import EmbedModal from 'components/EmbedModal';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading } = useContentDetails();
  const createdAt = content?.createdAt;
  const formattedCreatedDate = content
    ? new Date(createdAt as string).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const [isSuitableForChildrenModalOpen, setIsSuitableForChildrenModalOpen] =
    useState(() => {
      const isOver18 = localStorage.getItem(OVER_18);
      return isOver18 !== 'true';
    });
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const youtubeID = '';

  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const coverArtUrl = content?.coverImageUrl?.playerInfo?.publicUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const bannerImage = content?.bannerImageUrl?.playerInfo?.publicUrl;
  const linkUrl = content?.externalUrl;
  const linkTitle = content?.title;
  const mediaType = content?.type;
  const profileId = content?.profileId;

  // actual subtitle data coming soon!
  const subtitleUrl = '';

  // check if user is running Safari - Safari won't display the poster for the audio player component.
  // workaround is to show the poster as a background image if isSafari is true

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const onOver18Click = () => {
    localStorage.setItem(OVER_18, 'true');
    setIsSuitableForChildrenModalOpen(false);
  };

  const onUnder18Click = () => {
    localStorage.setItem(OVER_18, 'false');
    setIsSuitableForChildrenModalOpen(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      const headerHeight = document.querySelector('header')?.clientHeight || 0;
      const contentTop = contentRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: contentTop, behavior: 'auto' });
    }
  }, [contentRef.current, content]);

  useEffect(() => {
    const isOver18 = localStorage.getItem(OVER_18);
    if (content?.isSuitableForChildren === false && isOver18 !== 'true') {
      setIsSuitableForChildrenModalOpen(true);
    }
  }, [content?.isSuitableForChildren]);

  function handleClose() {
    setIsSuitableForChildrenModalOpen(false);
    setIsEmbedModalOpen(false);
  }

  const openEmbedModal = () => {
    setIsEmbedModalOpen(true);
  };

  function getContributorRole(role: string, count: number): string {
    let roleStr = '';
    switch (role) {
      case 'artist':
        roleStr = 'Artist';
        break;
      case 'editor':
        roleStr = 'Editor';
        break;
      case 'camera_operator':
        roleStr = 'Camera Operator';
        break;
      case 'sound_technician':
        roleStr = 'Sound Technician';
        break;
      // Add more roles as needed
      default: // capitalize first letter of role
        roleStr = role.charAt(0).toUpperCase() + role.slice(1);
    }
    // Add 's' to role if there are multiple contributors
    return count > 1 ? roleStr + 's' : roleStr;
  }

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
        subtitleUrl={subtitleUrl}
        isSafari={isSafari}
      />
    </s.AudioWrapper>
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
        onOver18Click={onOver18Click}
        onUnder18Click={onUnder18Click}
      />
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={handleClose}
        embedContentType={content?.type || ''}
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

          <s.ContentWrapper>
            <Typography component="h1" variant="h3">
              {content?.title}
            </Typography>

            <s.ContentDate component="p" variant="body2">
              {formattedCreatedDate}
            </s.ContentDate>

            <Stack direction="row" justifyContent="left">
              <s.EmbedWrapper>
                <CodeIcon />
                <s.Embed to={''} onClick={openEmbedModal}>
                  Embed
                </s.Embed>
              </s.EmbedWrapper>
            </Stack>

            <Typography component="p" variant="body1">
              {content?.description}
            </Typography>
          </s.ContentWrapper>
        </Grid>
        <Grid xs={10} md={3}>
          <s.Sidebar>
            {isLoading ? (
              <MediaMetaDataLoader />
            ) : (
              <>
                <Stack>
                  <Typography component="h5" variant="h5">
                    {t('Contributors')}
                  </Typography>
                  {content?.contributors &&
                    Object.entries(content?.contributors)
                      .sort(([roleA], [roleB]) => {
                        if (roleA === 'artist') {
                          return -1;
                        } else if (roleB === 'artist') {
                          return 1;
                        } else {
                          return roleA.localeCompare(roleB);
                        }
                      })
                      .map(([role, contributors]) => {
                        return (
                          <div key={role}>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                display: 'inline',
                                wordWrap: 'break-word',
                                fontSize: '16px',
                                color: theme.palette.primary.main
                              }}
                            >
                              {t(getContributorRole(role, contributors.length))}
                              :&nbsp;
                            </Typography>

                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                display: 'inline',
                                wordWrap: 'break-word',
                                fontWeight: '700',
                                lineHeight: '32px'
                              }}
                            >
                              {(contributors as Contributor[]).map(
                                (contributor, i) => (
                                  <span key={i}>
                                    {role === 'artist' && contributor.url ? (
                                      <Link
                                        href={contributor.url}
                                        sx={{ color: 'inherit' }}
                                      >
                                        {contributor.name}
                                      </Link>
                                    ) : (
                                      contributor.name
                                    )}
                                    {i < contributors.length - 1 ? ', ' : ''}
                                  </span>
                                )
                              )}
                            </Typography>
                          </div>
                        );
                      })}
                </Stack>
                {content?.collaboratorDetails &&
                  content?.collaboratorDetails[0]?.logoUrl !== null && (
                    <>
                      <s.Seperator />
                    </>
                  )}

                {/* Technically these are the Collaborators, not the Contributors.  I keep mixing them up as well :)  */}
                <Contributors
                  contributors={
                    content?.collaboratorDetails as CollaboratorDetails[]
                  }
                />

                <s.Seperator />

                {(content?.tags?.length || 0) > 0 && (
                  <Stack>
                    <Typography component="h5" variant="h5">
                      {t('Tags')}
                    </Typography>
                    <s.Tags sx={{ display: 'flex' }}>
                      {(content?.tags || [])
                        .join(', ')
                        .split(', ')
                        .map((tag: string, index: number, array: string[]) => (
                          <React.Fragment key={tag}>
                            <s.Tag
                              component="span"
                              variant="body2"
                              underline="true"
                            >
                              {tag}
                            </s.Tag>
                            {index < array.length - 1 && (
                              <s.Tag component="span" variant="body2">
                                ,&nbsp;
                              </s.Tag>
                            )}
                          </React.Fragment>
                        ))}
                    </s.Tags>
                  </Stack>
                )}
              </>
            )}

            <s.Seperator />
            {profileId && (
              <MoreContent
                profileId={profileId}
                excludeId={content?.id || ''}
              />
            )}
          </s.Sidebar>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Video;
