import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import { ContentLoader } from 'components/Loaders';
import { PropsWithChildren, useEffect, useState } from 'react';
import useProfileContent from 'hooks/useProfileContent';

interface MoreContentProps {
  profileId: string;
  excludeId: string;
}

const MoreContent = ({
  profileId,
  excludeId
}: PropsWithChildren<MoreContentProps>) => {
  const [moreContent, setMoreContent] = useState<any>([]);
  const [allContent, setAllContent] = useState<any>([]);
  const { t } = useTranslation();
  const { data: content, isLoading } = useProfileContent(profileId);

  useEffect(() => {
    if (content) {
      setMoreContent(content);
      setAllContent(content);
    }
  }, [content, excludeId]);

  useEffect(() => {
    const all = [...allContent];
    const filteredContent = all?.filter((c: any) => c.id !== excludeId);
    setMoreContent(filteredContent);
  }, [excludeId]);

  return (
    <Stack>
      {!isLoading && moreContent ? (
        <ContentList
          heading={t('More Content Like This')}
          content={moreContent.slice(0, 3)}
        />
      ) : (
        <Stack direction="column" spacing={2}>
          <ContentLoader size={1} />
        </Stack>
      )}
    </Stack>
  );
};

export default MoreContent;
