import { Box, Typography, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as s from './LinkPlayer.styled';
import { getOpenGraphData } from 'utils/openGraphUtils';

interface LinkPlayerProps {
  url: string;
  cover: string;
  title: string;
  coverImageAltText?: string;
  bannerImageAltText?: string;
}

const LinkPlayer = ({
  url,
  cover,
  title,
  coverImageAltText,
  bannerImageAltText
}: LinkPlayerProps) => {
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
          <Grid item xs={12} md={9.25}>
            {!isFile && (
              <s.ImageBox
                sx={{
                  height: {
                    xs: '200px',
                    md: '400px'
                  },
                  backgroundImage: `url(${cover.replace(/ /g, '%20')})`
                }}
              >
                <span role="img" aria-label={bannerImageAltText}></span>
              </s.ImageBox>
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
