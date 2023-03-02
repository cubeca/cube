import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';

const MoreContent = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useContent();

  const content = data ?? [];

  return (
    <Stack pb="2rem">
      <Typography component="h4" variant="h4" pb="1rem" sx={{ color: '#95F5CB' }}>
        {t('More Content Like This')}
      </Typography>
      {!isLoading ? (
        <ContentList content={content.slice(0, 3)} />
      ) : (
        <Stack direction="column" spacing={2}>
          <ContentLoader size={1} />
        </Stack>
      )}
    </Stack>
  );
};

export default MoreContent;
