import { useEffect, useRef, useState } from 'react';
import { Stack, Typography, useTheme, Chip, Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import { getIDfromURL } from 'utils/youtubeUtils';
import { useTranslation } from 'react-i18next';
import useContentDetails from 'hooks/useContentDetails';
import MoreContent from './MoreContent';
import Contributors from './Contributors';
import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';
import Footer from 'components/layout/Footer';
import * as s from './Content.styled';
import { CollaboratorDetails, Content, Contributor } from 'types/content';
import { Document, Page } from 'react-pdf';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer';

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
  // const youtubeID = getIDfromURL(content?.url || '');
  const youtubeID = '';
  //const youtubeID = getIDfromURL(
  //  'https://www.youtube.com/watch?v=LWnPSkRSLys&t=257s'
  //); // <-- test youtube state

  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const cover = content?.coverImageUrl?.playerInfo?.publicUrl;
  const desc = content?.description;
  const mediaType = content?.type;
  const profileId = content?.profileId;
  const contentId = content?.id;
  console.log(content);

  useEffect(() => {
    if (contentRef.current) {
      const headerHeight = document.querySelector('header')?.clientHeight || 0;
      const contentTop = contentRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: contentTop, behavior: 'auto' });
    }
  }, [contentRef.current, content]);

  function getContributorRole(role: string, names?: string[]): string {
    const roleMap: { [key: string]: string } = {
      sound: 'Sound Technician'
      // add more role mappings here as needed
    };
    const mappedRole = roleMap[role.toLowerCase()] || role;
    const numNames = (names || []).filter(
      (name) => name.split(':')[0] === role
    ).length;
    const pluralizedRole = numNames > 1 ? `${mappedRole}s` : mappedRole;
    return pluralizedRole.charAt(0).toUpperCase() + pluralizedRole.slice(1);
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
  // const pdfContent = (
  //   <LinkPlayer url={'http://google.ca'} alt={desc || ''} cover={cover || ''} />
  // );
  const videoContent = (
    <s.VideoWrapper>
      <MediaPlayer url={videoUrl || ''} />
    </s.VideoWrapper>
  );

  const linkContent = (
    <s.LinkWrapper>
      {/* <LinkPlayer url={'test.pdf'} cover={cover || ''} /> */}
      <LinkPlayer
        url={
          'https://cors-anywhere.herokuapp.com/https://github.com/microsoft/vscode'
        }
        // url={'test.pdf'}
        cover={cover || ''}
        title={content?.title || ''}
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

          <s.ContentWrapper>
            <Typography component="h1" variant="h3">
              {content?.title}
            </Typography>

            <s.ContentDate component="p" variant="body2">
              {formattedCreatedDate}
            </s.ContentDate>

            <Typography component="p" variant="body1">
              {content?.description}
            </Typography>

            {/* Testing fonts language support: <br/><br/>
            <Typography component="h1" variant="h3">
              hən̓q̓əmin̓əm̓ and Sḵwx̱wú7mesh Ta Nexwníw̓ n ta a Ímats, 授业
            </Typography>
            <br/>
            <Typography component="p" variant="body2">
              These are hən̓q̓əmin̓əm̓ and Sḵwx̱wú7mesh Ta Nexwníw̓ n ta a Ímats, 授业 [teachings] bequethed from ancestors to children of both Indigenous and migrant Chinese families. 从祖母到孙女，这些故事代代相传。[Cóng zǔmǔ dào sūnnǚ, zhèxiē gùshì dài dài xiāngchuán.]
            </Typography>
            <br/><br/> */}
          </s.ContentWrapper>
        </Grid>
        <Grid xs={10} md={3}>
          <s.Sidebar>
            {isLoading ? (
              <MediaMetaDataLoader />
            ) : (
              <>
                <Stack sx={{ my: 2 }}>
                  {content?.contributors &&
                    Object.entries(content?.contributors).map(
                      ([role, name]) => {
                        return (
                          <div key={role}>
                            <Typography
                              component="h5"
                              variant="h5"
                              sx={{ pb: 0.5 }}
                            >
                              {t(
                                getContributorRole(
                                  role,
                                  Object.keys(content?.contributors)
                                )
                              )}
                            </Typography>

                            <Typography
                              component="p"
                              variant="body2"
                              sx={{ pb: 1 }}
                            >
                              {name}
                            </Typography>
                          </div>
                        );
                      }
                    )}
                </Stack>
                {content?.collaboratorDetails &&
                  content?.collaboratorDetails[0]?.logoUrl !== null && (
                    <>
                      <s.Seperator />
                      <Typography component="h5" variant="h5">
                        {t('Collaborators')}
                      </Typography>
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
                        .map((tag: string) => (
                          <Chip key={tag} label={tag} sx={{ m: 0.5 }} />
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
