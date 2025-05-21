import { useEffect } from 'react';

/**
 * A custom hook to set the document title in an accessible way
 * @param title - The page-specific title
 * @param siteName - Optional site name to append (defaults to 'Cube')
 */
export const useDocumentTitle = (title: string, siteName = 'Cube') => {
  useEffect(() => {
    // Ensure the title is properly formatted for screen readers
    const formattedTitle = `${title} | ${siteName}`;
    document.title = formattedTitle;

    // Optionally announce title change to screen readers
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleElement.setAttribute('aria-live', 'polite');
    }

    return () => {
      // Cleanup if needed
      if (titleElement) {
        titleElement.removeAttribute('aria-live');
      }
    };
  }, [title, siteName]);
};
