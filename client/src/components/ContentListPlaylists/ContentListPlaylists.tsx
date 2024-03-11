import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ContentCard from 'components/ContentCard/ContentCard';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ContentListProps {
  content: any[];
  heading?: string;
  isLoggedIn?: boolean;
  playlistId?: string;
  handleNewMedia?: () => void;
}

const ContentListPlaylists: FC<ContentListProps> = ({
  heading,
  content,
  isLoggedIn = false,
  playlistId,
  handleNewMedia
}) => {
  const { t } = useTranslation();
  console.log(content);
  return (
    <Stack>
      {heading && (
        <Typography component="h5" variant="h5" pb="2rem">
          {heading}
        </Typography>
      )}
      <Stack direction="column">
        {content.map((c) => (
          <ContentCard
            key={c.id}
            image={
              c.data?.coverImageUrl?.playerInfo?.publicUrl ||
              c.coverImageExternalUrl ||
              ''
            }
            title={c.data.title}
            url={`/playlist/${c.id}`}
            icon={'playlist'}
            coverImageAltText={c.data.title}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ContentListPlaylists;
