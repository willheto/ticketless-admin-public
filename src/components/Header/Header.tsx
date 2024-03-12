import React from 'react';
import { Button, Container, Form, Modal, Offcanvas } from 'react-bootstrap';
import styled from 'styled-components';
import DesktopMenu from './DesktopMenu';
import { useUser } from '@src/context/UserContext';
import { IoChevronForwardOutline, IoLogOutOutline, IoMenuOutline } from 'react-icons/io5';
import useWindowSize from '@src/hooks/useWindowSize';
import { Link } from 'react-router-dom';
import { superAdmins } from '../../../superadmins';

const HeaderContainer = styled(Container).attrs({
	className: 'd-flex flex-column w-100',
})`
	@media (min-width: 1400px) {
		max-width: 1200px !important;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: top;
		padding-top: 1rem;
		max-width: 1200px;

		p {
			font-size: 1rem;
			font-weight: 600;
		}
	}

	.exhibitor--name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}
`;

const Header = (): JSX.Element | null => {
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const { setUser, user } = useUser();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

	const handleLogout = async (): Promise<void> => {
		localStorage.removeItem('ticketlessAdminAuthToken');
		setUser(null);
		setShowModal(false);
		window.location.href = '/';
	};

	const isMobile = useWindowSize();

	const handleOpenMenu = (): void => {
		setMobileMenuOpen(true);
	};

	if (!user) return null;

	return (
		<div
			style={{
				width: '100%',
				boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
				backgroundColor: 'white',
			}}
		>
			<Modal centered show={showModal} onHide={(): void => setShowModal(false)}>
				<div className="p-4 d-flex flex-column">
					<div className="align-self-center pb-4">
						<IoLogOutOutline size={55} />
					</div>
					<Form.Group className="text-center">
						<h3>Log out</h3>
					</Form.Group>

					<div className="d-flex mt-4 gap-2 justify-content-center">
						<Button onClick={(): Promise<void> => handleLogout()} className="btn-pink w-100">
							Log out
						</Button>
						<Button onClick={(): void => setShowModal(false)} variant="secondary w-100">
							Cancel
						</Button>
					</div>
				</div>
			</Modal>
			{!isMobile ? (
				<HeaderContainer>
					<div
						className={`container flex-column`}
						style={{
							paddingRight: '0px',
							paddingLeft: '0px',
						}}
					>
						<div className={`d-flex justify-content-between`}>
							<div className="d-flex gap-2 align-items-center justify-content-between w-100">
								<h1 className="mb-0">Ticketless Admin</h1>

								<div
									className="d-flex flex-column text-end"
									style={{
										fontWeight: 500,
									}}
								>
									Logged in as {user.email}
									<span
										style={{
											textDecoration: 'underline',
											cursor: 'pointer',
											alignSelf: 'flex-end',
										}}
										onClick={(): void => setShowModal(true)}
									>
										Log out
									</span>
								</div>
							</div>
						</div>
						<DesktopMenu />
					</div>
				</HeaderContainer>
			) : (
				<>
					<Offcanvas show={mobileMenuOpen} onHide={(): void => setMobileMenuOpen(false)} placement="end">
						<Offcanvas.Header
							closeButton
							style={{
								boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 3px',
								alignItems: 'center',
								display: 'flex',
							}}
						>
							<h3 className="mb-0">Ticketless admin</h3>
						</Offcanvas.Header>
						<Offcanvas.Body className="d-flex flex-column gap-4 justify-content-between">
							<nav className={`d-flex flex-column gap-4`}>
								{superAdmins.includes(user.email) && (
									<>
										<StyledNavLink to={`/overview`} onClick={(): void => setMobileMenuOpen(false)}>
											Overview
											<IoChevronForwardOutline />
										</StyledNavLink>
									</>
								)}
								<StyledNavLink to={`/events`} onClick={(): void => setMobileMenuOpen(false)}>
									Events
									<IoChevronForwardOutline />
								</StyledNavLink>
								<StyledNavLink to={`/calendar`} onClick={(): void => setMobileMenuOpen(false)}>
									Event calendar
									<IoChevronForwardOutline />
								</StyledNavLink>
								<StyledNavLink to={`/tickets`} onClick={(): void => setMobileMenuOpen(false)}>
									Tickets
									<IoChevronForwardOutline />
								</StyledNavLink>
								<StyledNavLink to={`/account`} onClick={(): void => setMobileMenuOpen(false)}>
									Account
									<IoChevronForwardOutline />
								</StyledNavLink>
								{superAdmins.includes(user.email) && (
									<>
										<StyledNavLink
											to={`/organizations`}
											onClick={(): void => setMobileMenuOpen(false)}
										>
											Organizations
											<IoChevronForwardOutline />
										</StyledNavLink>
										<StyledNavLink to={`/users`} onClick={(): void => setMobileMenuOpen(false)}>
											Users
											<IoChevronForwardOutline />
										</StyledNavLink>
										<StyledNavLink
											to={`/advertisements`}
											onClick={(): void => setMobileMenuOpen(false)}
										>
											Advertisements
											<IoChevronForwardOutline />
										</StyledNavLink>
									</>
								)}
							</nav>
							<StyledNavLink
								to={`/#`}
								onClick={(): void => setShowModal(true)}
								theme={{
									noBorder: true,
								}}
							>
								Log out
								<IoChevronForwardOutline />
							</StyledNavLink>
						</Offcanvas.Body>
					</Offcanvas>
					<MobileMenuContainer>
						<h3 className="mb-0">Ticketless Admin</h3>
						<IoMenuOutline
							size={30}
							style={{
								cursor: 'pointer',
							}}
							onClick={handleOpenMenu}
						/>
					</MobileMenuContainer>
				</>
			)}
		</div>
	);
};

const StyledNavLink = styled(Link).attrs({})`
	display: flex;
	justify-content: space-between;
	padding: 0 5px 5px 5px;
	color: #f24594;
	font-size: 15px;
	font-weight: 500;
	border-bottom: 2px solid transparent;
	text-decoration: none;
	transition: all 0.1s ease;
	white-space: nowrap;
	${(props): string => props.theme.isActive && 'border-bottom: 4px solid #f24594;'}
	border-bottom: ${(props): string => (!props.theme.noBorder ? '2px solid ghostwhite' : 'none')};

	&:hover {
		transform: scale(1.01);
	}

	&.active {
		color: #f24594;
		border-bottom: 2px solid #f24594;
		text-decoration: none;
		pointer-events: none;
	}
`;

const MobileMenuContainer = styled.div`
	padding: 0.75rem;
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
`;

export default Header;
