import { Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LinkIcon from '@mui/icons-material/Link';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import * as s from './ContentCard.styled';

export interface ContentCardProps {
  url: string;
  creator?: string;
  image: string;
  title: string;
  icon?: string;
  hasSignLanguage?: boolean;
  coverImageAltText?: string;
}

const ContentCard: FC<ContentCardProps> = ({
  title,
  image,
  icon,
  url,
  hasSignLanguage,
  coverImageAltText
}) => {
  return (
    <s.ContentCard className="content-card">
      <Link to={url} title={title}>
        <s.Thumbnail
          sx={{
            backgroundImage: `url('${image}')`
          }}
          aria-label={coverImageAltText}
        >
          <span role="img" aria-label={coverImageAltText}></span>
        </s.Thumbnail>
        <div className="types"></div>

        <s.Data direction="row" alignItems="space-between">
          <Typography component="div" className="title">
            {title}
          </Typography>
          <div className="types">
            {icon === 'video' ? (
              <PlayArrowIcon fontSize="small" />
            ) : icon === 'audio' ? (
              <VolumeUpIcon fontSize="small" />
            ) : icon === 'pdf' ? (
              <MenuBookIcon fontSize="small" />
            ) : icon === 'link' ? (
              <LinkIcon fontSize="small" />
            ) : (
              <></>
            )}
            {hasSignLanguage && <SignLanguageIcon fontSize="small" />}
          </div>
        </s.Data>
      </Link>
    </s.ContentCard>
  );
};

export default ContentCard;
