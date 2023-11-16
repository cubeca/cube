import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Stack, Typography, useTheme, Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import CodeIcon from '@mui/icons-material/Code';

import useContentDetails from 'hooks/useContentDetails';

import MoreContent from './MoreContent';
import Contributors from './Contributors';
import * as s from './Content.styled';

import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';
import Footer from 'components/layout/Footer';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import { CollaboratorDetails } from 'types/content';
import AgeCheckModal from 'components/AgeCheckModal';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer/LinkPlayer';
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
    useState(true);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const youtubeID = '';

  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const bannerImage = content?.bannerImageUrl?.playerInfo?.publicUrl;
  const linkUrl = content?.externalUrl;
  const linkTitle = content?.title;
  const mediaType = content?.type;
  const profileId = content?.profileId;

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
    setIsEmbedModalOpen(false);
  }

  function getContributorRole(role: string, names?: string[]): string {
    const roleMap: { [key: string]: string } = {
      sound: 'Sound Technician',
      camera: 'Camera Operator',
      editor: 'Editor',
      artist: 'Artist'
      // add more role mappings here as needed
    };
    const mappedRole = roleMap[role.toLowerCase()] || role;

    if (typeof names === 'string') {
      return 'Data has been changed';
    }

    // pluralize role if there are multiple names
    const numNames = (names || []).length;
    const pluralizedRole = numNames > 1 ? `${mappedRole}s` : mappedRole;
    return pluralizedRole.charAt(0).toUpperCase() + pluralizedRole.slice(1);
  }

  const openEmbedModal = () => {
    setIsEmbedModalOpen(true);
  };

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
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={handleClose}
        embedContent={content?.mediaUrl?.playerInfo?.publicUrl || ''}
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
              <Typography component="p" variant="body1">
                <CodeIcon />
                <Link to={''} onClick={openEmbedModal}>
                  Embed
                </Link>
              </Typography>
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
                      .map(([role, names]) => {
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
                              {t(getContributorRole(role, names))}:&nbsp;
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
                              {/* error handling to deal with old data that doesn't have an array of names */}
                              {Array.isArray(names)
                                ? names.join(', ')
                                : 'Data has been changed'}
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
