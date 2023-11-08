import { Box, Typography, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as s from './LinkPlayer.styled';

// function to get Open Graph data for URL - abandoned for now
async function getOpenGraphData(url: string) {
  if (url.startsWith('https://')) {
    // only run if URL is https and not http or file://

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
    let html;
    try {
      html = await response.text();
    } catch (error) {
      console.error('Failed to fetch html: ', error);
      return { title: '', description: '', image: '' };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const titleElement =
      doc.querySelector('meta[property="og:title"]') ||
      doc.querySelector('title');
    const title = titleElement
      ? titleElement.getAttribute('content') || titleElement.textContent
      : '';

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
      ? imageElement.getAttribute('content') ||
        imageElement.getAttribute('href')
      : '';

    return { title, description, image };
  } else {
    return { title: '', description: '', image: '' };
  }
}

interface LinkPlayerProps {
  url: string;
  cover: string;
  title: string;
}

const LinkPlayer = ({ url, cover, title }: LinkPlayerProps) => {
  // check if URL is a file
  const isFile =
    /\.(jpeg|jpg|gif|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|tar|gz|7z|exe|dll)$/i.test(
      url
    );

  // logic for fetching Open Graph data
  // const {
  //   data,
  //   isLoading: loading,
  //   error
  // } = useQuery<
  //   { title: string | null; description: string | null; image: string | null },
  //   { message: string }
  // >(['openGraphData', url], () => getOpenGraphData(url));

  // if (loading) {
  //   return <p>Loading preview...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }

  // const { title, description, image } = data;

  return (
    <s.Container>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Grid container justifyContent="center">
          <Grid xs={12} md={9.25}>
            {!isFile && (
              <s.ImageBox
                sx={{
                  height: {
                    xs: '200px',
                    md: '400px'
                  },
                  backgroundImage: `url(${cover})`
                }}
              ></s.ImageBox>
            )}
            <s.UrlInfoBox>
              <s.LeftContainer>
                {isFile && (
                  <InsertDriveFileIcon
                    sx={{ marginRight: '10px', fontSize: 48, color: '#57838B' }}
                  />
                )}
                <s.SubContainer>
                  <Typography component="p" variant="body2">
                    {isFile ? new URL(url).pathname.split('/').pop() : url}
                  </Typography>
                  <s.ContentTitleText variant="h3">{title}</s.ContentTitleText>
                </s.SubContainer>
              </s.LeftContainer>
              <OpenInNewIcon
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  fontSize: 32
                }}
              />
            </s.UrlInfoBox>
          </Grid>
        </Grid>
      </a>
    </s.Container>
  );
};

export default LinkPlayer;
