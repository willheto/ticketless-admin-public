import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../components/Page/Page';
import api from '../../api';
import { Button } from 'react-bootstrap';
import OrganizationForm from './OrganizationForm';
import SearchBar from '@src/components/SearchBar/SearchBar';
import { StyledTable } from '@src/components/Table/Table';

const Organizations = (): JSX.Element => {
	const [organizations, setOrganizations] = React.useState<OrganizationInterface[]>([]);
	const [isEditingOrganization, setIsEditingOrganization] = React.useState<OrganizationInterface | null | undefined>(
		undefined,
	);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const fetchOrganizations = useCallback(async (): Promise<void> => {
		try {
			const response = await api.organizations.getAll();
			setOrganizations(response);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const handleEdit = (organization: OrganizationInterface): void => {
		setIsEditingOrganization(organization);
	};

	useEffect(() => {
		fetchOrganizations();
	}, [fetchOrganizations]);

	useEffect(() => {
		const organizations = document.getElementById('organizations');
		setTimeout((): void => {
			organizations?.classList.remove('fade-in');
			organizations?.classList.add('fade-over');
		}, 100);
	}, []);

	const columns = [
		{
			name: 'name',
			label: 'Name',
			render: (organization: OrganizationInterface): string => {
				return organization.name;
			},
		},
		{
			name: 'license',
			label: 'License',
			render: (organization: OrganizationInterface): string => {
				if (!organization.license) {
					return 'No license';
				}
				const license = organization.license;
				return license.charAt(0).toUpperCase() + license.slice(1);
			},
		},
		{
			name: 'location',
			label: 'Location',
		},
	];

	const filterOrganizations = useCallback(
		(organization: OrganizationInterface): boolean => {
			return (
				organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				organization.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				false
			);
		},
		[searchTerm],
	);

	const refetch = (): void => {
		fetchOrganizations();
	};

	return (
		<Page>
			<div className="container">
				<div className="d-flex justify-content-between align-items-center w-100">
					<Page.Title>Organizations</Page.Title>
					<Button className="btn-pink" onClick={(): void => setIsEditingOrganization(null)}>
						Create organization
					</Button>
				</div>
				<Page.Content className="fade-in" id="organizations">
					<OrganizationForm
						editingOrganization={isEditingOrganization}
						setIsEditingOrganization={setIsEditingOrganization}
						refetch={refetch}
					/>
					<SearchBar setSearchTerm={setSearchTerm} />
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
								{organizations
									.filter(organization => filterOrganizations(organization))
									.sort((a, b) => {
										return a.created_at > b.created_at ? -1 : 1;
									})
									.map((organization: OrganizationInterface) => {
										return (
											<tr
												key={organization.organizationID}
												style={{
													cursor: 'pointer',
												}}
												onClick={(): void => handleEdit(organization)}
											>
												{columns.map((column, index) => {
													return (
														<td key={index}>
															{column.render
																? column.render(organization)
																: organization[column.name]}
														</td>
													);
												})}
											</tr>
										);
									})}
							</tbody>
						</StyledTable>
					</div>
				</Page.Content>
			</div>
		</Page>
	);
};

export default Organizations;
