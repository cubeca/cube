/**
 * `CustomErrorBoundary` is a component that serves as an error boundary for its child components.
 * It uses `react-error-boundary` to catch JavaScript errors anywhere in the child component tree, log those errors,
 * and display a fallback UI instead of the component tree that crashed. The fallback UI includes a "Try again" button
 * that, when clicked, attempts to reset the error state and recover from the error.
 */

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import Button from 'components/Button';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface CustomErrorBoundaryProps {
  children: ReactNode;
}

const CustomErrorBoundary: React.FC<CustomErrorBoundaryProps> = ({
  children
}: CustomErrorBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          {resetErrorBoundary && (
            <Button onClick={resetErrorBoundary}>Try again</Button>
          )}
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
