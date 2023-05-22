import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateProfileLogo,
  updateProfileSection,
  updateProfileHero,
  updateProfileAudioDescription
} from 'api/profile';

const useEditProfile = (profileId: string) => {
  const queryClient = useQueryClient();

  const updateSectionMutation = useMutation({
    mutationFn: (body: { id: string; description: string }) =>
      updateProfileSection(body.id, body.description),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile', profileId]
      })
  });

  const updateLogoMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileLogo(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile', profileId]
      })
  });

  const updateHeroMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileHero(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile', profileId]
      })
  });

  const updateAudioMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileAudioDescription(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile', profileId]
      })
  });

  const updateSection = (id: string, description: string) => {
    updateSectionMutation.mutate({
      id,
      description
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
    updateHero,
    updateAudioDescription
  };
};

export default useEditProfile;
