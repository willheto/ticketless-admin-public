import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import App from '../App/App';
import api from '../../api/index';
import axiosInstance from '../../api/axiosInstance';
import { UserProvider } from '../../context/UserContext';
import { superAdmins } from '../../../superadmins';
import loginImage from '../../assets/loginImage.jpg';
import logo_vari from '../../assets/logo_vari.svg';
const Root = (): JSX.Element => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
	const [user, setUser] = useState<UserInterface | null>(null);
	const [error, setError] = useState<string>('');

	const hasUserAccess = (user: UserInterface): boolean => {
		return user.userType === 'admin' || superAdmins.includes(user.email);
	};

	const setTokenToLocalStorage = (token: string): void => {
		localStorage.setItem('ticketlessAdminAuthToken', token);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		try {
			setIsLoggingIn(true);

			const response = await api.auth.login(email, password);

			setIsLoggingIn(false);

			if (response?.user) {
				if (hasUserAccess(response.user)) {
					setUser(response.user);
					setTokenToLocalStorage(response.token);
				} else {
					setError('Wrong email or password');
				}
			} else if (response.error) {
				setError(response.error);
			} else if (response === 'Too many requests, please try again later.') {
				setError(response);
			}
		} catch (error) {
			setError(error);
			setIsLoggingIn(false);
		}
	};

	/**
	 * Fetch user data from the backend
	 */
	useEffect(() => {
		const fetchUser = async (): Promise<void> => {
			try {
				const response = await axiosInstance.post('/admin/user/auth', {
					token: localStorage.getItem('ticketlessAdminAuthToken'),
				});
				// @ts-expect-error - user is not null
				setUser(response.user);
			} catch (error) {
				setUser(null);
			}
		};

		fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

	useEffect(() => {
		const handleResize = (): void => {
			setWindowSize(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return (): void => window.removeEventListener('resize', handleResize);
	}, []);

	if (!user) {
		return (
			<div className="d-flex w-100 overflow-hidden">
				<div
					className={`d-flex ${windowSize <= 768 && 'justify-content-center align-items-center'} flex-column`}
					style={{
						minWidth: '400px',
						width: windowSize <= 768 ? '100%' : '400px',
						padding: windowSize <= 768 ? '0 20px' : '50px',
					}}
				>
					<Form onSubmit={(e: React.FormEvent<HTMLFormElement>): Promise<void> => onSubmit(e)}>
						{windowSize > 768 && <img src={logo_vari} alt="logo" className="mb-4" />}

						<h2 className="mb-4">Ticketless admin</h2>
						<h3>Login</h3>
						<Form.Label>Email</Form.Label>
						<Form.Control
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
						/>
						<Form.Label>Password</Form.Label>
						<Form.Control
							value={password}
							type="password"
							onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
						/>
						{error && <p className="text-danger mb-0">{error}</p>}
						<Button className="mt-2 btn-pink" disabled={isLoggingIn} type="submit">
							Login
						</Button>
					</Form>
				</div>
				{windowSize > 768 && <img src={loginImage} alt="login" />}
			</div>
		);
	} else {
		return (
			<UserProvider defaultUser={user}>
				<App />
			</UserProvider>
		);
	}
};

export default Root;
