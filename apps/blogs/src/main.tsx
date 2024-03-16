import { Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './styles.css';

import App from './app/app';
import { ApolloProvider } from '@apollo/client';
import client from './app/graphql/apollo-client';
import { Provider as AtomProvider } from 'jotai';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AtomProvider>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense>
            <App />
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  </AtomProvider>
);
