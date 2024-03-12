import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/Root/Root';
import './index.scss';
import { QueryClient, QueryClientProvider } from 'react-query';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');
const root = ReactDOM.createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<Root />
		</QueryClientProvider>
	</BrowserRouter>,
);
