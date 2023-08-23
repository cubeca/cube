import { getProfileByTag } from 'api/profile';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { filesApi } from 'api';
import { useEffect, useState } from 'react';
import { getProfileId } from 'utils/auth';

const useProfile = () => {
  const { tag } = useParams();
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [heroUrl, setHeroUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [descriptionUrl, setDescriptionUrl] = useState('');
  const profileId = getProfileId();

  const { isLoading, isError, data } = useQuery(
    ['profile_by_tag', tag],
    () => getProfileByTag(tag ?? ''),
    { enabled: !!tag }
  );

  const profile = data?.data;

  useEffect(() => {
    if (profile) {
      setIsLoadingImages(true);
      const getImages = async (profile: any) => {
        if (tag) {
          const hero = await filesApi.fileDetails(profile.herofileid);
          const logo = await filesApi.fileDetails(profile.logofileid);
          const description = await filesApi.fileDetails(profile.descriptionfileid)
          setHeroUrl((hero.data.playerInfo as any).publicUrl);
          setLogoUrl((logo.data.playerInfo as any).publicUrl);
          setDescriptionUrl((description.data.playerInfo as any).publicUrl);
          setIsLoadingImages(false);
        }
      };
      getImages(profile);
    }
  }, [profile]);

  return {
    isLoading: isLoading || isLoadingImages,
    isError,
    data: {
      ...profile,
      heroUrl,
      logoUrl,
      descriptionUrl,
      profileId
    }
  };
};

export default useProfile;
