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
  const [randomContent, setRandomContent] = useState([]);
  const { t } = useTranslation();
  const { data: content, isLoading } = useProfileContent(profileId);

  function getRandomContent(content: any[], count: number) {
    const shuffled = content.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  useEffect(() => {
    if (content) {
      const filteredContent = (content as unknown as Array<any>).filter(
        (c: any) => c.id !== excludeId
      );
      setAllContent(filteredContent);
    }
  }, [content, excludeId]);

  useEffect(() => {
    setMoreContent(allContent);
    setRandomContent(getRandomContent(allContent, 3) as never[]);
  }, [allContent]);

  return (
    <Stack>
      {!isLoading && moreContent.length > 0 ? (
        <ContentList
          heading={t('More Content Like This')}
          content={randomContent}
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
