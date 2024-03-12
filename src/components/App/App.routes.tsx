import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Events from '../../views/Events/Events';
import Organizations from '../../views/Organization/Organizations';
import { useUser } from '../../context/UserContext';
import Overview from '../../views/Overview/Overview';
import Users from '@src/views/Users/Users';
import Tickets from '@src/views/Tickets/Tickets';
import Advertisements from '@src/views/Advertisements/Advertisements';
import { superAdmins } from '../../../superadmins';
import EventCalendar from '@src/views/EventCalendar/EventCalendar';
import Files from '@src/views/Files/Files';
import Account from '@src/views/Account/Account';

/**
 * Redirects to /events
 * @returns
 */
const Redirect = (): JSX.Element => {
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (superAdmins.includes(user?.email)) {
			navigate('/overview');
			return;
		}
		navigate('/events');
	}, [navigate, user]);
	return <div></div>;
};

const AppRoutes = (): JSX.Element | null => {
	const { user } = useUser();

	if (!user) return null;
	return (
		<Routes>
			<Route path="/" element={<Redirect />} />
			{superAdmins.includes(user.email) && <Route path="overview" element={<Overview />} />}
			<Route path="events" element={<Events />} />
			<Route path="calendar" element={<EventCalendar />} />
			<Route path="tickets" element={<Tickets />} />
			<Route path="account" element={<Account />} />
			{superAdmins.includes(user.email) && (
				<>
					<Route path="organizations" element={<Organizations />} />
					<Route path="users" element={<Users />} />
					<Route path="advertisements" element={<Advertisements />} />
					<Route path="files" element={<Files />} />
				</>
			)}
		</Routes>
	);
};

export default AppRoutes;
