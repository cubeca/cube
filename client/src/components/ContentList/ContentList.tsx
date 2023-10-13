import { Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import ContentCard from 'components/ContentCard/ContentCard';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ContentListProps {
  content: any[];
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
      <Stack direction="column">
        {content.map((c) => (
          <ContentCard
            key={c.id}
            image={c.coverImageUrl?.playerInfo?.publicUrl || ''}
            title={c.title}
            creator={c.creator}
            url={`/content/${c.id}`}
            icon={c.icon}
            hasSignLanguage={c.hasSignLanguage}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ContentList;
