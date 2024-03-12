import api from '@src/api';
import { Loading } from '@src/components/Loading/Loading';
import Page from '@src/components/Page/Page';
import SearchBar from '@src/components/SearchBar/SearchBar';
import { StyledTable } from '@src/components/Table/Table';
import React, { useCallback, useEffect, useState } from 'react';
import UserForm from './UserForm';

const Users = (): JSX.Element => {
	const [users, setUsers] = React.useState<UserInterface[]>([]);
	const [organizations, setOrganizations] = React.useState<OrganizationInterface[]>([]);
	const [editingUser, setEditingUser] = useState<UserInterface | null | undefined>(undefined);
	const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
	const [isLoadingOrganizations, setIsLoadingOrganizations] = useState<boolean>(false);

	const [searchTerm, setSearchTerm] = useState<string>('');

	const fetchUsers = useCallback(async (): Promise<void> => {
		setIsLoadingUsers(true);
		try {
			const response = await api.users.getAll();
			setUsers(response);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingUsers(false);
		}
	}, []);

	const fetchOrganizations = useCallback(async (): Promise<void> => {
		setIsLoadingOrganizations(true);
		try {
			const response = await api.organizations.getAll();
			setOrganizations(response);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingOrganizations(false);
		}
	}, []);

	React.useEffect(() => {
		fetchUsers();
		fetchOrganizations();
	}, [fetchUsers, fetchOrganizations]);

	const getReadableDate = (date: string): string => {
		const dateObject = new Date(date);
		return dateObject.toLocaleDateString('fi-FI');
	};

	const handleEdit = (user: UserInterface): void => {
		setEditingUser(user);
	};

	const filterUsers = (user: UserInterface): boolean => {
		return (
			user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.city?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	useEffect(() => {
		const users = document.getElementById('users');
		setTimeout((): void => {
			users?.classList.remove('fade-in');
			users?.classList.add('fade-over');
		}, 100);
	}, []);

	const columns = [
		{
			name: 'firstName',
			label: 'Name',
			render: (user: UserInterface): JSX.Element => {
				return (
					<span>
						{user.firstName} {user.lastName}
					</span>
				);
			},
		},
		{
			name: 'email',
			label: 'Email',
		},
		{
			name: 'phoneNumber',
			label: 'Phone number',
		},

		{
			name: 'city',
			label: 'City',
		},

		{
			name: 'userType',
			label: 'Type',
			render: (user: UserInterface): JSX.Element => {
				return <span>{user.userType?.charAt(0).toUpperCase() + user.userType?.slice(1)}</span>;
			},
		},
		{
			name: 'organizationID',
			label: 'Organization',
			render: (user: UserInterface): JSX.Element => {
				if (!user.organizationID) return <span>-</span>;
				const organization = organizations.find(
					organization => organization.organizationID === user.organizationID,
				);

				return <span>{organization?.name}</span>;
			},
		},
		{
			name: 'created_at',
			label: 'Created at',
			render: (user: UserInterface): JSX.Element => {
				return <span>{getReadableDate(user.created_at)}</span>;
			},
		},
	];

	const refetch = (): void => {
		fetchUsers();
		fetchOrganizations();
	};

	return (
		<Page>
			<div className="container pb-4">
				<div className="d-flex justify-content-between align-items-center w-100">
					<Page.Title>Users</Page.Title>
				</div>

				<Page.Content className="fade-in" id="users">
					{isLoadingUsers || isLoadingOrganizations ? (
						<div className="h-100 d-flex justify-content-center align-items-center">
							<Loading text="Fetching users..." />
						</div>
					) : (
						<div className="d-flex flex-column gap-2 mt-2">
							<SearchBar setSearchTerm={setSearchTerm} />
							<UserForm
								editingUser={editingUser}
								setEditingUser={setEditingUser}
								organizations={organizations}
								refetch={refetch}
							/>
							<div className="overflow-auto">
								<StyledTable>
									<thead>
										<tr>
											{columns.map((column, index) => {
												return <th key={index}>{column.label}</th>;
											})}
										</tr>
									</thead>
									<tbody>
										{users
											.filter(user => filterUsers(user))
											.sort((a, b) => {
												return a.created_at > b.created_at ? -1 : 1;
											})
											.map((user: UserInterface) => {
												return (
													<tr
														key={user.userID}
														style={{
															cursor: 'pointer',
														}}
														onClick={(): void => handleEdit(user)}
													>
														{columns.map((column, index) => {
															return (
																<td key={index}>
																	{column.render
																		? column.render(user)
																		: user[column.name]}
																</td>
															);
														})}
													</tr>
												);
											})}
									</tbody>
								</StyledTable>
							</div>
						</div>
					)}
				</Page.Content>
			</div>
		</Page>
	);
};

export default Users;
