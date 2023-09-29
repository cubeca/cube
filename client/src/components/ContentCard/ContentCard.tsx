import { Box, Card, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as PlayButton } from 'assets/icons/play.svg';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import * as s from './ContentCard.styled';

export interface ContentCardProps {
  url: string;
  creator?: string;
  image: string;
  title: string;
  icon?: string;
  hasSignLanguage?: boolean;
}

const ContentCard: FC<ContentCardProps> = ({
  creator,
  title,
  image,
  icon,
  url,
  hasSignLanguage
}) => {
  return (
    <s.ContentCard>
      <Link to={url}>
        <s.Thumbnail
          sx={{
            backgroundImage: `url('${image}')`
          }}
        >
          <div className='types'>
            {icon}
            {hasSignLanguage && <SignLanguageIcon fontSize="small" />}
          </div>
        </s.Thumbnail>

        <s.Data direction="row" alignItems="space-between">
          <Typography component="span" className="title">
            {title}
          </Typography>
          {creator && (
            <Typography component="span" className="creator">
              {creator}
            </Typography>
          )}
        </s.Data>
      </Link>
    </s.ContentCard>
  );
};

export default ContentCard;
