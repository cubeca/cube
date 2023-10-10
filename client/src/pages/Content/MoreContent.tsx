import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';
import { PropsWithChildren, useEffect, useState } from 'react';
import { getProfileId } from 'utils/auth';
import { contentApi } from 'api';
// import { getContentByProfileId } from 'api/content';
// import { Content } from 'types/content';
interface MoreContentProps {
  profileId: string;
}

const MoreContent = ({ profileId }: PropsWithChildren<MoreContentProps>) => {
  const [moreContent, setMoreContent] = useState<any>([]);
  const { t } = useTranslation();
  const { data, isLoading } = useContent();

  useEffect(() => {
    contentApi.getContentByProfileid(0, 10, profileId).then((res) => {
      setMoreContent(res.data);
      console.log(res.data);
    });
  }, []);

  // const dummyContent: Content[] = [
  //   {
  //     id: 1,
  //     thumbnailUrl:
  //       'https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=760&q=80',
  //     title: 'Dummy Content 1',
  //     creator: 'Creator 1',
  //     url: 'https://example.com/content/1',
  //     icon: 'https://dummyimage.com/32x32/000/fff',
  //     hasSignLanguage: true
  //   },
  //   {
  //     id: 2,
  //     thumbnailUrl:
  //       'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=766&q=80',
  //     title: 'Dummy Content 2',
  //     creator: 'Creator 2',
  //     url: 'https://example.com/content/2',
  //     icon: 'https://dummyimage.com/32x32/000/fff',
  //     hasSignLanguage: false
  //   },
  //   {
  //     id: 3,
  //     thumbnailUrl:
  //       'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=724&q=80',
  //     title: 'Dummy Content 3',
  //     creator: 'Creator 3',
  //     url: 'https://example.com/content/3',
  //     icon: 'https://dummyimage.com/32x32/000/fff',
  //     hasSignLanguage: true
  //   }
  // ];

  // const content = data ?? [];
  // console.log(content);
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
