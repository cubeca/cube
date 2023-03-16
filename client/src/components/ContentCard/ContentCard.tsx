import { Box, Card, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as PlayButton } from 'assets/icons/play.svg';
import * as s from './ContentCard.styled';

export interface ContentCardProps {
  url: string;
  creator?: string;
  image: string;
  title: string;
  icon?: string;
}

const ContentCard: FC<ContentCardProps> = ({
  creator,
  title,
  image,
  icon,
  url
}) => {
  return (
    <s.ContentCard>
      <Link to={url}>
        <s.Thumbnail
          sx={{
            backgroundImage: `url('${image}')`
          }}
        >
          {icon && <img src={icon} alt="" />}
        </s.Thumbnail>

        <s.Data direction="row" alignItems="space-between">
          <Typography component="span">{title}</Typography>
          {creator && <Typography component="span">{creator}</Typography>}
        </s.Data>
      </Link>
    </s.ContentCard>
  );
};

export default ContentCard;
