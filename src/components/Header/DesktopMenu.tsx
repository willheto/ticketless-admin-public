import { useUser } from '@src/context/UserContext';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { superAdmins } from '../../../superadmins';

const StyledNavLink = styled(Link).attrs({})`
	display: inline-block;
	padding: 0 5px 5px 5px;
	color: #f24594;
	font-size: 15px;
	font-weight: 500;
	border-bottom: 2px solid transparent;
	text-decoration: none;
	transition: all 0.1s ease;
	white-space: nowrap;
	${(props): string => props.theme.isActive && 'border-bottom: 4px solid #f24594;'}

	&:hover {
		transform: scale(1.1);
	}

	&.active {
		color: #f24594;
		border-bottom: 2px solid #f24594;
		text-decoration: none;
		pointer-events: none;
	}
`;

const DesktopMenu = (): JSX.Element | null => {
	const [pathName, setPathName] = React.useState(window.location.pathname.split('/')[1]);
	const location = useLocation();
	const isActiveTab = (tab: string): boolean => pathName === tab;

	const { user } = useUser();

	useEffect(() => {
		setPathName(window.location.pathname.split('/')[1]);
	}, [location]);

	if (!user) return null;

	return (
		<div className="d-flex justify-content-between" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
			<nav className={`mt-5 d-flex gap-5`}>
				{superAdmins.includes(user.email) && (
					<StyledNavLink
						to={`/overview`}
						theme={{
							isActive: isActiveTab('overview'),
						}}
					>
						Overview
					</StyledNavLink>
				)}
				<StyledNavLink
					to={`/events`}
					theme={{
						isActive: isActiveTab('events'),
					}}
				>
					Events
				</StyledNavLink>
				<StyledNavLink
					to={`/calendar`}
					theme={{
						isActive: isActiveTab('calendar'),
					}}
				>
					Calendar
				</StyledNavLink>
				<StyledNavLink
					to={`/tickets`}
					theme={{
						isActive: isActiveTab('tickets'),
					}}
				>
					Tickets
				</StyledNavLink>
				<StyledNavLink
					to={`/account`}
					theme={{
						isActive: isActiveTab('account'),
					}}
				>
					Account
				</StyledNavLink>
				{superAdmins.includes(user.email) && (
					<>
						<StyledNavLink
							to={`/organizations`}
							theme={{
								isActive: isActiveTab('organizations'),
							}}
						>
							Organizations
						</StyledNavLink>
						<StyledNavLink
							to={`/users`}
							theme={{
								isActive: isActiveTab('users'),
							}}
						>
							Users
						</StyledNavLink>
						<StyledNavLink
							to={`/advertisements`}
							theme={{
								isActive: isActiveTab('advertisements'),
							}}
						>
							Advertisements
						</StyledNavLink>
						<StyledNavLink
							to={`/files`}
							theme={{
								isActive: isActiveTab('files'),
							}}
						>
							Files
						</StyledNavLink>
					</>
				)}
			</nav>
		</div>
	);
};

export default DesktopMenu;
