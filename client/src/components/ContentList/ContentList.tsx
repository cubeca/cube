import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ContentCard from 'components/ContentCard/ContentCard';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentListed } from '@cubeca/bff-client-oas-axios';

interface ContentListProps {
  content: ContentListed[];
  heading?: string;
  isLoggedIn?: boolean;
  handleNewMedia?: () => void;
}

const ContentList: FC<ContentListProps> = ({
  heading,
  content,
  isLoggedIn = false,
  handleNewMedia
}) => {
  const { t } = useTranslation();

  return (
    <Stack>
      {heading && (
        <Typography component="h5" variant="h5" pb="2rem">
          {heading}
        </Typography>
      )}
      <Stack direction='column'>
        {content.map((c) => (
          
          <ContentCard
            key={c.id}
            image={c.thumbnailUrl}
            title={c.title}
            creator={c.creator}
            url={c.url}
            icon={c.iconUrl}
          />

        ))}
      </Stack>
    </Stack>
  );
};

export default ContentList;
