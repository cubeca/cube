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
import { Content } from 'types/content';
import { Document, Page } from 'react-pdf';
import PDFReader from 'components/PDFReader';

// Dummy interface for my dummy data for now, to be removed

interface OrgContributor {
  id: string;
  name: string;
  socialUrl: string;
  artist: boolean;
  socialHandle: string;
  logoUrl: string;
}

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

  // const dummyContent: ArtContributor = {
  //   artists: ['Billy Paintpaint', 'Gazelle Rivers', 'Juice Box'],
  //   cameraOperators: ['Jimmy Snaps', 'Leila Lens', 'Sally Shutter'],
  //   editors: ['Detail Dan', 'Edit Ed', 'Cutting Carl'],
  //   soundTechnicians: [
  //     'Audio Al',
  //     'Sound Sam',
  //     'Soundboard Steve',
  //     'Soundy McSoundface'
  //   ],
  //   carpenters: ['Carpenter 1', 'Carpenter 2']
  // };

  // Dummy data for contributors for now, as this data is currently not coming from backend

  const dummyContributors: OrgContributor[] = [
    {
      id: '1',
      name: 'Foundation of Everything',
      socialUrl: 'https://example.com/contributor1',
      artist: true,
      socialHandle: '@FOE',
      logoUrl:
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '2',
      name: 'Art Attack',
      socialUrl: 'https://example.com/contributor2',
      artist: false,
      socialHandle: '@AA2023',
      logoUrl:
        'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '3',
      name: 'Canada Council for the Arts',
      socialUrl: 'https://example.com/contributor3',
      artist: true,
      socialHandle: '@CCFA',
      logoUrl:
        'https://images.unsplash.com/photo-1549277513-f1b32fe1f8f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    }
  ];

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
  //   <object
  //     data={pdfUrl}
  //     type="application/pdf"
  //     width="100%"
  //     height="500px"
  //     aria-label={content?.description || 'PDF cannot be displayed'}
  //   >
  //     <p>PDF cannot be displayed</p>
  //   </object>
  // );

  const videoContent = (
    <s.VideoWrapper>
      <MediaPlayer url={videoUrl || ''} />
    </s.VideoWrapper>
  );

  return (
    <Box ref={contentRef}>
      <Grid container justifyContent="center">
        <Grid xs={12} md={9}>
          {isLoading ? (
            <MediaPlayerLoader type={mediaType ? mediaType : 'video'} />
          ) : youtubeID != '' ? (
            youtubeContent
          ) : audioUrl != null && content?.type === 'audio' ? (
            audioContent
          ) : content?.type === 'pdf' ? (
            pdfContent
          ) : content?.type === 'video' ? (
            videoContent
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

            {/* <MediaPlayer url={content?.description || ''} isAudio /> */}
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
                  {/* {content?.contributors &&
                    content?.contributors.length > 0 &&
                    content?.contributors[0] !== '' &&
                    content?.contributors[0] !== null &&
                    content?.contributors.map((contributor: string) => {
                      const [role, name] = contributor.split(':');
                      return (
                        <div key={contributor}>
                          <Typography
                            component="h5"
                            variant="h5"
                            sx={{ pb: 0.5 }}
                          >
                            {t(
                              getContributorRole(
                                role,
                                content?.contributors || []
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
                    })} */}
                </Stack>

                <s.Seperator />
                <Typography component="h5" variant="h5">
                  {t('Collaborators')}
                </Typography>

                {/* Technically these are the Collaborators, not the Contributors.  I keep mixing them up as well :)  */}

                <Contributors contributors={dummyContributors} />

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

            <MoreContent
              profileId={profileId || ''}
              excludeId={content?.id || ''}
            />
          </s.Sidebar>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Video;
