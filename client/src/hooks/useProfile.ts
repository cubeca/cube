import { getProfile } from 'api/profile';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { filesApi } from 'api';
import { useEffect, useState } from 'react';
import { getProfileId } from 'utils/auth';

const useProfile = () => {
  const { id } = useParams();
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [herourl, setHerourl] = useState('');
  const [logourl, setLogourl] = useState('');
  const profileId = getProfileId();

  const { isLoading, isError, data } = useQuery(
    ['profile', id],
    () => getProfile(id ?? ''),
    { enabled: !!id }
  );

  const profile = data?.data;

  useEffect(() => {
    if (profile) {
      setIsLoadingImages(true);
      const getImages = async (profile: any) => {
        if (id) {
          const hero = await filesApi.fileDetails(profile.herourl);
          const logo = await filesApi.fileDetails(profile.logourl);
          setHerourl((hero.data.playerInfo as any).publicUrl);
          setLogourl((logo.data.playerInfo as any).publicUrl);
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
      herourl,
      logourl,
      profileId
    }
  };
};

export default useProfile;
