import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateProfileLogo,
  updateProfileSection,
  updateProfileHero,
  updateProfileAudioDescription
} from 'api/profile';
import { useState } from 'react';

const useEditProfile = (profileTag: string) => {
  const queryClient = useQueryClient();
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const updateSectionMutation = useMutation({
    mutationFn: (body: {
      id: string;
      description: string;
      organization: string;
      website: string;
      budget: string;
    }) =>
      updateProfileSection(
        body.id,
        body.organization,
        body.website,
        body.description,
        body.budget
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      })
  });

  const updateHeroMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) => {
      setIsUploadingHero(true);
      return updateProfileHero(body.id, body.file);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      });
      setIsUploadingHero(false);
    },
    onError: (error) => {
      console.log('Hero upload error', error);
      setIsUploadingHero(false);
    }
  });

  const updateLogoMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) => {
      setIsUploadingLogo(true);
      return updateProfileLogo(body.id, body.file);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      });

      setIsUploadingLogo(false);
    },
    onError: (error) => {
      console.log('Logo upload error', error);
      setIsUploadingLogo(false);
    }
  });

  const updateAudioMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileAudioDescription(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      })
  });

  const updateSection = (
    id: string,
    organization: string,
    website: string,
    description: string,
    budget: string
  ) => {
    updateSectionMutation.mutate({
      id,
      organization,
      website,
      description,
      budget
    });
  };

  const updateLogo = (id: string, file: File) => {
    updateLogoMutation.mutate({
      id,
      file
    });
  };

  const updateHero = (id: string, file: File) => {
    updateHeroMutation.mutate({
      id,
      file
    });
  };

  const updateAudioDescription = (id: string, file: File) => {
    updateAudioMutation.mutate({
      id,
      file
    });
  };

  return {
    updateSection,
    updateLogo,
    isUploadingHero,
    updateHero,
    isUploadingLogo,
    updateAudioDescription
  };
};

export default useEditProfile;
