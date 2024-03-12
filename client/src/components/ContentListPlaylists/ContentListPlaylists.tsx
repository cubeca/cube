import { Stack, Typography } from '@mui/material';
import ContentCard from 'components/ContentCard/ContentCard';
import { FC } from 'react';

interface ContentListProps {
  content: any[];
  heading?: string;
  isLoggedIn?: boolean;
  playlistId?: string;
  handleNewMedia?: () => void;
}

const ContentListPlaylists: FC<ContentListProps> = ({ heading, content }) => {
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
              c?.coverImageUrl?.playerInfo?.publicUrl ||
              c.coverImageExternalUrl ||
              ''
            }
            title={c.title}
            url={`/playlist/${c.id}`}
            icon={'playlist'}
            coverImageAltText={c.title}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ContentListPlaylists;
