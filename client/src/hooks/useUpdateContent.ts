/**
 * `useUpdateContent` is a custom React hook designed to handle the updating of content items. The hook utilizes the `updateContent` 
 * function imported from the `../api/content` module. 

 * The main functionality of the hook is exposed through the `execute` function, which performs the update operation. This function 
 * takes the content `id`, a `payload` object containing the new content data, and file objects for the cover image, banner image, 
 * or VTT file. It sets the loading state, clears any previous errors, and then calls `updateContent`. If the operation is successful, 
 * the loading state is updated; if an error occurs, the error state is set with the encountered error.

 * @param {string} id - The unique identifier of the content item to be updated.
 * @param {any} payload - The new data for the content item. The exact structure of this data depends on the `ContentType` definition.
 * @param {File} coverImageFile - The new file for the content item's cover image.
 * @param {File} bannerImageFile - The new file for the content item's banner image.
 * @param {File} vttFile - The new VTT file for the content item's captions.
 * @returns {Object} An object containing:
 *   - `isLoading`: A boolean indicating if the update operation is in progress.
 *   - `error`: An error object if an error occurred during the update operation, otherwise `null`.
 *   - `execute`: A function to trigger the update operation with the specified parameters.
 */

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
