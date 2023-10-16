import useContent from 'hooks/useContent';
import ContentCard from 'components/ContentCard';
import { ContentLoader } from 'components/Loaders';
import UserContentFilter from './UserContentFilter';
import { ContentLists } from 'types/enums';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
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

interface UserContentProps {
  content?: any;
}

const UserContent = ({ content }: UserContentProps) => {
  return (
    <s.UserContentWrapper>
      <UserContentFilter />

      <s.UserContent>
        {!content && (
          <Lottie
            className="loading-cubes"
            animationData={LoadingCubes}
            loop={true}
          />
        )}
        {
        content?.map((c: any) => (
          <ContentCard
            key={c.id}
            image={c.coverImageUrl.playerInfo.publicUrl}
            title={c.title}
            creator={c.creator}
            url={`/content/${c.id}`}
            icon={c.iconUrl}
          />
        ))}
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default UserContent;
