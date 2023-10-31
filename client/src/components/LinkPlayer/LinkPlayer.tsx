import { FC } from 'react';
import ReactPlayer from 'react-player';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as s from './LinkPlayer.styled';
import Grid from '@mui/system/Unstable_Grid';

async function getOpenGraphData(url: string) {
  if (url.startsWith('file://')) {
    // Skip for file URLs
    return { title: '', description: '', image: '' };
  }
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  const html = await response.text();

  console.log('HTML:', html);

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  console.log('Parsed doc:', doc);

  const titleElement =
    doc.querySelector('meta[property="og:title"]') ||
    doc.querySelector('title');
  const title = titleElement
    ? titleElement.getAttribute('content') || titleElement.textContent
    : '';

  console.log(title);
  const descriptionElement =
    doc.querySelector('meta[property="og:description"]') ||
    doc.querySelector('meta[name="description"]');
  const description = descriptionElement
    ? descriptionElement.getAttribute('content')
    : '';

  const imageElement =
    doc.querySelector('meta[property="og:image"]') ||
    doc.querySelector('link[rel="shortcut icon"]');
  const image = imageElement
    ? imageElement.getAttribute('content') || imageElement.getAttribute('href')
    : '';

  return { title, description, image };
}

interface LinkPlayerProps {
  url: string;
  cover: string;
  title: string;
}

const LinkPlayer: FC<LinkPlayerProps> = ({ url, cover }) => {
  const isFile =
    /\.(jpeg|jpg|gif|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|tar|gz|7z|exe|dll)$/i.test(
      url
    );

  const {
    data,
    isLoading: loading,
    error
  } = useQuery<
    { title: string | null; description: string | null; image: string | null },
    { message: string }
  >(['openGraphData', url], () => getOpenGraphData(url));

  if (loading) {
    return <p>Loading preview...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const { title, description, image } = data;
  console.log(data);

  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <Grid container justifyContent="center">
        <Grid xs={12} md={9.25}>
          <s.ImageBox
            sx={{
              height: {
                xs: '200px',
                md: '400px'
              },
              backgroundImage: `url(${
                image ||
                'https://images.unsplash.com/photo-1694402315953-f9fdabd9a5f2?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              })`
            }}
          ></s.ImageBox>
          <s.UrlInfoBox>
            <s.LeftContainer sx={{ display: 'flex' }}>
              {isFile && <InsertDriveFileIcon sx={{ marginRight: '10px' }} />}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component="p" variant="body2">
                  {!isFile && new URL(url).hostname}
                </Typography>
                <Typography variant="h4">{!isFile ? title : url}</Typography>
              </Box>
            </s.LeftContainer>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
            </a>
          </s.UrlInfoBox>
          <Typography
            component="p"
            variant="body2"
            sx={{ color: (theme) => theme.palette.primary.dark }}
          >
            {!isFile && url}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkPlayer;
