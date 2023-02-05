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
