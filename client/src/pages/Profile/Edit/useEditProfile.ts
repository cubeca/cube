import { useMutation } from '@tanstack/react-query';
import {
  updateProfileLogo,
  updateProfileSection,
  updateProfileHero,
  updateProfileAudioDescription
} from 'api/profile';

const useEditProfile = () => {
  const updateSectionMutation = useMutation(
    (body: { id: string; name: string; description: string }) =>
      updateProfileSection(body.id, body.name, body.description)
  );

  const updateLogoMutation = useMutation((body: { id: string; file: File }) =>
    updateProfileLogo(body.id, body.file)
  );

  const updateHeroMutation = useMutation((body: { id: string; file: File }) =>
    updateProfileHero(body.id, body.file)
  );

  const updateAudioMutation = useMutation((body: { id: string; file: File }) =>
    updateProfileAudioDescription(body.id, body.file)
  );

  const updateSection = (id: string, name: string, description: string) => {
    updateSectionMutation.mutate({
      id,
      name,
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
