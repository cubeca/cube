import { Stack } from '@mui/material';
import ContentCard from 'components/ContentCard';

import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';
import UserContentFilter from './UserContentFilter';
import { ContentLists } from 'types/enums';
import { ContentListed } from '@cubeca/bff-client-oas-axios';

const UserContent = () => {
  const { data, isLoading } = useContent('featured', ContentLists.Featured);

  const content = data ?? [];

  return (
    <>
      <UserContentFilter />
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

export default UserContent;
