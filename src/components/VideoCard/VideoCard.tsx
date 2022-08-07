import { Box, Card, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as PlayButton } from 'assets/icons/play.svg';

export interface VideoCardProps {
  url: string;
  creator?: string;
  image: string;
  title: string;
  icon?: string;
}

const VideoCard: FC<VideoCardProps> = ({
  creator,
  title,
  image,
  icon,
  url
}) => {
  return (
    <Card>
      <Stack>
        <Box>
          <Link to={url}>
            <Box
              sx={{
                display: 'flex',
                width: '200px',
                backgroundImage: `url('${image}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
              p="20px"
              justifyContent="center"
            >
              <div style={{ display: 'inline-block' }}>
                <PlayButton />
              </div>
            </Box>
          </Link>
        </Box>
        <Stack direction="row" alignItems="flex-start">
          {icon && <img src={icon} alt="" style={{ padding: '10px' }} />}
          <Stack direction="column">
            {creator && (
              <Typography component="span" sx={{ fontWeight: 'bold' }} pt="7px">
                {creator}
              </Typography>
            )}
            <Typography component="span">{title}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default VideoCard;
