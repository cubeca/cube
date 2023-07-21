import Grid from '@mui/system/Unstable_Grid';
import * as s from './ThumbnailGrid.styled';

const ThumbnailGrid = ({ thumbs, alignment }: any) => {
  const nodes: any[] = [];

  thumbs.forEach((obj: any) => {
    switch (obj.type) {
      case 'transparent':
        nodes.push(
          <Grid xs={6} md={6}>
            <s.ThumbTransparent></s.ThumbTransparent>
          </Grid>
        );
        break;
      case 'dark':
        nodes.push(
          <Grid xs={6} md={6}>
            <s.ThumbDark></s.ThumbDark>
          </Grid>
        );
        break;
      case 'light':
        nodes.push(
          <Grid xs={6} md={6}>
            <s.ThumbLight></s.ThumbLight>
          </Grid>
        );
        break;
      case 'img':
        nodes.push(
          <Grid xs={6} md={6}>
            <s.ThumbImg>
              <img src={obj.src} alt="thumbnail" />
            </s.ThumbImg>
          </Grid>
        );
        break;
    }
  });

  return (
    <s.ThumbnailGridWrapper alignment={alignment}>
      <Grid container>{nodes}</Grid>
    </s.ThumbnailGridWrapper>
  );
};

export default ThumbnailGrid;
