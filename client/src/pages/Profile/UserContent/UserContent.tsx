import useContent from 'hooks/useContent';
import ContentCard from 'components/ContentCard';
import { ContentLoader } from 'components/Loaders';
import UserContentFilter from './UserContentFilter';
import { ContentLists } from 'types/enums';
import { ContentListed } from '@cubeca/bff-client-oas-axios';
import * as s from './UserContent.styled';

import collaboration from 'assets/icons/type-collaboration.svg';
import video from 'assets/icons/type-video.svg';
import audio from 'assets/icons/type-audio.svg';
import book from 'assets/icons/type-book.svg';
import publication from 'assets/icons/type-publication.svg';

import FPOThumb1 from 'assets/images/fpo/billetto-editorial-dGYN1ApujRo-unsplash-thumb.png';
import FPOThumb2 from 'assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import FPOThumb3 from 'assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FPOThumb4 from 'assets/images/fpo/ryan-stefan-5K98ScREEUY-unsplash-thumb.png';
import FPOThumb5 from 'assets/images/fpo/filip-zrnzevic-QsWG0kjPQRY-unsplash-thumb.png';
import FPOThumb6 from 'assets/images/fpo/coline-beulin-oLWGI-Q76Yc-unsplash-thumb.png';
import FPOThumb7 from 'assets/images/fpo/abi-baurer-2xbcFBRGsZo-unsplash-thumb.png';
import FPOThumb8 from 'assets/images/fpo/eldar-nazarov-gnYfMrL0rck-unsplash-thumb.png';

const UserContent = () => {
  const { data, isLoading } = useContent('featured', ContentLists.Featured);

  // const content = data ?? [
  const content = [
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Video Title',
      url: 'https://www.example.com',
      iconUrl: video
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb2,
      title: 'Video Title',
      url: 'https://www.example.com',
      iconUrl: video
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb3,
      title: 'Video Title',
      url: 'https://www.example.com',
      iconUrl: video
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb4,
      title: 'Audio Title',
      url: 'https://www.example.com',
      iconUrl: audio
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb5,
      title: 'Audio Title',
      url: 'https://www.example.com',
      iconUrl: audio
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb6,
      title: 'Audio Title',
      url: 'https://www.example.com',
      iconUrl: audio
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb7,
      title: 'Book Title',
      url: 'https://www.example.com',
      iconUrl: book
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb8,
      title: 'Book Title',
      url: 'https://www.example.com',
      iconUrl: book
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Book Title',
      url: 'https://www.example.com',
      iconUrl: book
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb2,
      title: 'Publication Title',
      url: 'https://www.example.com',
      iconUrl: publication
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb3,
      title: 'Publication Title',
      url: 'https://www.example.com',
      iconUrl: publication
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb4,
      title: 'Publication Title',
      url: 'https://www.example.com',
      iconUrl: publication
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb5,
      title: 'Collaboration Title',
      url: 'https://www.example.com',
      iconUrl: collaboration
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb6,
      title: 'Collaboration Title',
      url: 'https://www.example.com',
      iconUrl: collaboration
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb7,
      title: 'Collaboration Title',
      url: 'https://www.example.com',
      iconUrl: collaboration
    }
  ];

  return (
    <s.UserContentWrapper>
      <UserContentFilter />

      <s.UserContent>
        {!isLoading ? (
          content.map((c: any) => (
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
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default UserContent;
