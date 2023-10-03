import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateProfileLogo,
  updateProfileSection,
  updateProfileHero,
  updateProfileAudioDescription
} from 'api/profile';

const useEditProfile = (profileTag: string) => {
  const queryClient = useQueryClient();

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

  const updateLogoMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileLogo(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      })
  });

  const updateHeroMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileHero(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      })
  });

  const updateAudioMutation = useMutation({
    mutationFn: (body: { id: string; file: File }) =>
      updateProfileAudioDescription(body.id, body.file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['profile_by_tag', profileTag]
      })
  });

  const updateSection = (id: string, organization: string, website: string, description: string, budget: string) => {
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
    updateHero,
    updateAudioDescription
  };
};

export default useEditProfile;
