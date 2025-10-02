'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryRoot({ children }: { children: ReactNode }) {
  console.log('🔍 QueryRoot: Component is rendering');
  const [client] = useState(() => {
    console.log('🔍 QueryRoot: Creating new QueryClient');
    const queryClient = new QueryClient();
    console.log('🔍 QueryRoot: QueryClient created:', queryClient);
    return queryClient;
  });

  console.log(
    '🔍 QueryRoot: About to render QueryClientProvider with client:',
    client
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

