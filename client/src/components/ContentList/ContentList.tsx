/**
 * `ContentList` is a functional React component that renders a list of content items using the `ContentCard` component.
 * It optionally displays a heading above the list.
 */

import { Stack, Typography } from '@mui/material';
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

const ContentList: FC<ContentListProps> = ({
  heading,
  content,
  playlistId
}) => {
  const { t } = useTranslation();

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
              c.coverImageUrl?.playerInfo?.publicUrl ||
              c.coverImageExternalUrl ||
              ''
            }
            title={c.title}
            creator={c.creator}
            url={
              playlistId
                ? `/content/${c.id}?playlist=${playlistId}`
                : `/content/${c.id}`
            }
            icon={c.type}
            hasSignLanguage={c.hasSignLanguage}
            coverImageAltText={c.coverImageText}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ContentList;
