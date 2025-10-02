import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient';
import { ComponentType } from 'react';

// Higher-Order Component to provide QueryClient context
const withQuery = <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent = (props: P) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    );
  };

  WrappedComponent.displayName = `withQuery(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default withQuery;

