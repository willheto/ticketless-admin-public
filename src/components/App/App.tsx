import React from 'react';
import AppRoutes from './App.routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Header/Header';

const App = (): JSX.Element => {
	return (
		<div
			className="d-flex flex-column w-100"
			style={{
				backgroundColor: 'ghostwhite',
			}}
		>
			<Header />
			<AppRoutes />
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={true}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				progressStyle={{ background: '#f24594' }}
				style={{
					width: '100%',
					maxWidth: '300px',
					top: '0px',
				}}
			/>
		</div>
	);
};

export default App;
