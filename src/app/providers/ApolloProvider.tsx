'use client';

import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ReactNode, useMemo } from 'react';

export default function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({ uri: '/graphql' }),
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
