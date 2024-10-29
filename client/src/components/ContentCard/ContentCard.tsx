/**
 * `ContentCard` is a functional React component that displays a card with content information. 
 * It supports displaying an image, title, and an optional icon to denote the type of content (e.g., video, audio, article). 
 * Additionally, it can indicate if the content includes sign language support. 

 * @param {string} url The URL to navigate to when the card is clicked.
 * @param {string} image The URL of the image to display on the card.
 * @param {string} title The title of the content to display.
 * @param {string} [icon] The name of the icon to display on the card, indicating the type of content (optional).
 * @param {string} [creator] The creator of the content (optional).
 * @param {boolean} [hasSignLanguage] Indicates if the content includes sign language support (optional).
 * @param {string} [coverImageAltText] The alt text for the cover image (optional).
 */

import { Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListItemIcon from '@mui/icons-material/List';
import LinkIcon from '@mui/icons-material/Link';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import DocIcon from '@mui/icons-material/Article';
import { ReactComponent as PlaylistIcon } from '../../assets/icons/playlist.svg';
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
  // Clean the URL for the image to prevent errors originating from special characters
  const cleanedUrl = image
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/ /g, '%20');

  return (
    <s.ContentCard className="content-card">
      <Link to={url} title={title}>
        <s.Thumbnail
          sx={{
            backgroundImage: `url('${cleanedUrl}')`
          }}
          aria-label={coverImageAltText}
        >
        </s.Thumbnail>

        <s.Data direction="row" alignItems="space-between">
          <Typography component="h4" className="title">
            {title}
          </Typography>
          <div className="types">
            {icon === 'video' ? (
              <PlayArrowIcon fontSize="small" titleAccess="Video Icon"/>
            ) : icon === 'audio' ? (
              <VolumeUpIcon fontSize="small" titleAccess="Audio Icon"/>
            ) : icon === 'pdf' ? (
              <MenuBookIcon fontSize="small" titleAccess="PDF Icon"/>
            ) : icon === 'link' ? (
              <LinkIcon fontSize="small" titleAccess="Linked Page Icon"/>
            ) : icon === 'playlist' ? (
              <ListItemIcon fontSize="small" titleAccess="Playlist Icon" aria-label="Playlist Icon"/>
            ) : icon === 'document' ? (
              <DocIcon fontSize="small" titleAccess="Word Doc Icon"/>
            ) : (
              <></>
            )}
            {hasSignLanguage && <SignLanguageIcon fontSize="small" titleAccess="Sign Language Icon"/>}
          </div>
        </s.Data>
      </Link>
    </s.ContentCard>
  );
};

export default ContentCard;
