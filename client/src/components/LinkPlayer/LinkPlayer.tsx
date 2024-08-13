/**
 * `LinkPlayer`, used on the Content page for Link content, renders a clickable container leading to a specified URL.
 * It is designed to visually represent a link, optionally displaying a cover image and a title.
 * The component determines if the provided URL points to a file based on its extension and adjusts its presentation accordingly.
 * If the URL is identified as a file link, a file icon is displayed.
 *
 * @param {string} url The URL that the component should link to.
 * @param {string} cover The URL of an image to display as a cover for the link.
 * @param {string} title The title of the link to display.
 * @param {string} [coverImageAltText] Optional alt text for the cover image, for accessibility.
 */

import { Typography, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as s from './LinkPlayer.styled';

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
  bannerImageAltText
}: LinkPlayerProps) => {
  // check if URL is a file
  const isFile =
    /\.(jpeg|jpg|gif|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|tar|gz|7z|exe|dll)$/i.test(
      url
    );

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
