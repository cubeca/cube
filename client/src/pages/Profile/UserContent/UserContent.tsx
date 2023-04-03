import useContent from 'hooks/useContent';
import ContentCard from 'components/ContentCard';
import { ContentLoader } from 'components/Loaders';
import UserContentFilter from './UserContentFilter';
import * as s from './UserContent.styled';
import { ContentLists } from 'types/enums';

interface Props {
  profileId: string;
}

const UserContent = ({ profileId }: Props) => {
  const { data: content, isLoading } = useContent({
    listName: profileId,
    category: ContentLists.Featured,
    creatorId: profileId
  });

  return (
    <s.UserContentWrapper>
      <UserContentFilter />

      <s.UserContent>
        {!isLoading ? (
          (content as unknown as []).map((c: any) => (
            <ContentCard
              key={c.id}
              title={c.data.title}
              creator={c.data.creator}
              contentId={c.id}
              coverImageFileId={c.data.coverImageFileId}
              icon={c.data.iconUrl}
            />
          ))
        ) : (
          <ContentLoader size={6} />
        )}
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default UserContent;
