import { Stack } from '@mui/material';
import ContentCard from 'components/ContentCard';

import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';
import { ContentLists } from 'types/enums';
import { ContentListed } from '@cubeca/bff-client-oas-axios';

const ContentByMedium = () => {
  const { data, isLoading } = useContent('featured', ContentLists.Featured);

  const content = data ?? [];

  return (
    <>
     
      <Stack direction="row" spacing={6} py="4rem">
        {!isLoading ? (
          content.map((c: ContentListed) => (
            <ContentCard
              key={c.id}
              image={c.thumbnailUrl}
              title={c.title}
              creator={c.creator}
              url={c.url}
              icon={c.iconUrl}
            />
          ))
        ) : (
          <ContentLoader size={6} />
        )}
      </Stack>
    </>
  );
};

export default ContentByMedium;