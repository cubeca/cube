import { Stack } from '@mui/material';
import ContentCard from 'components/ContentCard';

import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';
import FeaturedContentFilter from './FeaturedContentFilter';
import { ContentLists } from 'types/enums';
import { ContentListed } from '@cubeca/bff-client-oas-axios';

const FeaturedContent = () => {
  const { data, isLoading } = useContent({
    listName: 'featured',
    category: ContentLists.Featured
  });

  const content = data ?? [];

  return (
    <>
      <FeaturedContentFilter />
      <Stack direction="row" spacing={6} py="4rem">
        {!isLoading ? (
          (content as unknown as []).map((c: ContentListed) => (
            <div key={c.id}>Content</div>
            // <ContentCard
            //   key={c.id}
            //   image={c.thumbnailUrl}
            //   title={c.title}
            //   creator={c.creator}
            //   url={c.url}
            //   icon={c.iconUrl}
            // />
          ))
        ) : (
          <ContentLoader size={6} />
        )}
      </Stack>
    </>
  );
};

export default FeaturedContent;
