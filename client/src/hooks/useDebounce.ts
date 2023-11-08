import { useState, useEffect } from 'react';

// This hook allows you to debounce any fast-changing value.
// The debounced value will only change after the specified delay.
// If the value is an empty string, and a defaultValue is provided, it returns the defaultValue.
function useDebounce<T>(value: T, delay: number, defaultValue?: T): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Handler to set debouncedValue
      const handler = setTimeout(() => {
        setDebouncedValue(value !== '' ? value : defaultValue ?? value);
      }, delay);

      // Cleanup function to cancel the timeout if value or delay changes
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value, delay, or defaultValue changes
    [value, delay, defaultValue]
  );

  return debouncedValue;
}

export default useDebounce;
