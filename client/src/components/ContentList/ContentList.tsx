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
        <Typography pb="2rem" pt="1.5rem">
          {heading}
        </Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'column', md: 'row'}}
  spacing={{ xs: 3, sm: 3, md: 4 }}>
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
