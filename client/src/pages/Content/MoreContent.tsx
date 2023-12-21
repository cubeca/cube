import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import { ContentLoader } from 'components/Loaders';
import { PropsWithChildren, useEffect, useState } from 'react';
import useProfileContent from 'hooks/useProfileContent';
import { searchContent } from 'api/search';
interface MoreContentProps {
  profileId: string;
  excludeId: string;
  currentTags?: string[];
}

const MoreContent = ({
  profileId,
  excludeId,
  currentTags = []
}: PropsWithChildren<MoreContentProps>) => {
  const [moreContentByTag, setMoreContentByTag] = useState<any>([]);
  const [moreContent, setMoreContent] = useState<any>([]);
  const [allContent, setAllContent] = useState<any>([]);
  const [randomContent, setRandomContent] = useState([]);
  const [loadingMoreContentByTag, setLoadingMoreContentByTag] = useState(true);

  const { t } = useTranslation();

  // get other content from this profile, in case no tag match
  const { data: profileContent, isLoading } = useProfileContent(profileId);

  function getRandomContent(content: any[], count: number) {
    const shuffled = content.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  // get more content by tag
  const fetchContent = async () => {
    try {
      setLoadingMoreContentByTag(true);
      const joinedSearchTerms = currentTags.join(' ');
      console.log('joinedSearchTerms', joinedSearchTerms);
      console.log(currentTags);
      const test = ['test', 'another'];
      const results = await searchContent('test', 0, 6, { tags: test });

      console.log('results', results);
      setMoreContentByTag(results);
      setLoadingMoreContentByTag(false);
    } catch (error) {
      console.error(error);
      setLoadingMoreContentByTag(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (!loadingMoreContentByTag && randomContent.length === 0) {
      // uncomment this once we fix the tag search bit
      // let contentToUse =
      //   moreContentByTag && moreContentByTag.length > 0
      //     ? moreContentByTag
      //     : profileContent;
      let contentToUse = moreContentByTag;

      if (contentToUse === undefined || contentToUse === null) {
        contentToUse = [];
      }

      // Randomize the content and set it to randomContent
      const randomizedContent = getRandomContent(contentToUse, 3);
      setRandomContent(randomizedContent as never[]);
    }
  }, [moreContentByTag, profileContent, loadingMoreContentByTag]);

  return (
    <Stack>
      {!isLoading && randomContent.length > 0 ? (
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
