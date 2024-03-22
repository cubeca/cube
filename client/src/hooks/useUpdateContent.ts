import { SetStateAction, useState } from 'react';
import { updateContent } from '../api/content';
import { ContentType } from '../api/content';

export const useUpdateContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  interface UpdateContentPayload {
    id: any;
    payload: ContentType;
    coverImageFile: File;
    bannerImageFile: File;
    vttFile: File;
  }

  const execute = async (
    id: string,
    payload: any,
    coverImageFile: File,
    bannerImageFile: File,
    vttFile: File
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateContent({
        id,
        payload,
        coverImageFile,
        bannerImageFile,
        vttFile
      });
      return response;
    } catch (err) {
      setError(err as SetStateAction<null>);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
};
