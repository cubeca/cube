import { Box, Card, Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface VideoCardProps {
  url: string;
  creator: string;
  image: string;
  title: string;
  icon: string;
}

const VideoCard: FC<VideoCardProps> = ({ creator, title, image, icon }) => {
  return (
    <Card>
      <Stack>
        <Box>
          <img src={image} alt="" />
        </Box>
        <Stack direction="row" alignItems="flex-start">
          <img src={icon} alt="" style={{ padding: '10px' }} />
          <Stack direction="column">
            <Typography component="span" sx={{ fontWeight: 'bold' }} pt="7px">
              {creator}
            </Typography>
            <Typography component="span">{title}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default VideoCard;
