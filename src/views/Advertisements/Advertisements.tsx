import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../components/Page/Page';
import api from '@src/api';
import { Button } from 'react-bootstrap';
import { Loading } from '@src/components/Loading/Loading';
import SearchBar from '@src/components/SearchBar/SearchBar';
import { useUser } from '@src/context/UserContext';
import { StyledTable } from '@src/components/Table/Table';
import { formatDate, utcStringToLocalDate } from '@src/utils/dateUtils';
import AdvertisementForm from './AdvertisementForm';

const Advertisements = (): JSX.Element => {
	const [advertisements, setAdvertisements] = React.useState<AdvertisementInterface[]>([]);
	const [editingAdvertisement, setEditingAdvertisement] = useState<AdvertisementInterface | null | undefined>(
		undefined,
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const { user } = useUser();

	const fetchAdvertisements = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await api.advertisements.getAll();
			setAdvertisements(response);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (user) {
			fetchAdvertisements();
		}
	}, [fetchAdvertisements, user]);

	const handleEdit = (advertisement: AdvertisementInterface): void => {
		setEditingAdvertisement(advertisement);
	};

	const filterAdvertisements = (advertisement: AdvertisementInterface): boolean => {
		return (
			advertisement.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
			advertisement.contentHtml.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	useEffect(() => {
		const advertisements = document.getElementById('advertisements');
		setTimeout((): void => {
			advertisements?.classList.remove('fade-in');
			advertisements?.classList.add('fade-over');
		}, 100);
	}, []);

	const columns = [
		{
			name: 'advertiser',
			label: 'Advertiser',
		},
		{
			name: 'created_at',
			label: 'Created At',
			render: (advertisement: AdvertisementInterface): JSX.Element => {
				return <span>{formatDate(utcStringToLocalDate(advertisement.created_at), 'dateTime')}</span>;
			},
		},
		{
			name: 'isActive',
			label: 'Active',
			render: (advertisement: AdvertisementInterface): JSX.Element => {
				return <span>{advertisement.isActive ? 'Yes' : 'No'}</span>;
			},
		},
		{
			name: 'type',
			label: 'Type',
			render: (advertisement: AdvertisementInterface): JSX.Element => {
				return <span>{advertisement.type.charAt(0).toUpperCase() + advertisement.type.slice(1)}</span>;
			},
		},
		{
			name: 'location',
			label: 'Location',
			render: (advertisement: AdvertisementInterface): JSX.Element => {
				return <span>{advertisement.location || 'None specified'}</span>;
			},
		},
		{
			name: 'updated_at',
			label: 'Updated At',
			render: (advertisement: AdvertisementInterface): JSX.Element => {
				if (advertisement.updated_at) {
					return <span>{formatDate(utcStringToLocalDate(advertisement.updated_at), 'dateTime')}</span>;
				} else {
					return <span>Not updated</span>;
				}
			},
		},
	];

	return (
		<Page>
			<div className="container pb-4">
				<div className="d-flex justify-content-between align-items-center w-100">
					<Page.Title>Advertisements</Page.Title>
					<Button className="btn-pink" onClick={(): void => setEditingAdvertisement(null)}>
						Create
					</Button>
				</div>

				<Page.Content className="fade-in" id="advertisements">
					{isLoading ? (
						<div className="h-100 d-flex justify-content-center align-items-center">
							<Loading text="Fetching advertisements..." />
						</div>
					) : (
						<div className="d-flex flex-column gap-2 mt-2">
							<SearchBar setSearchTerm={setSearchTerm} />
							<AdvertisementForm
								editingAdvertisement={editingAdvertisement}
								setEditingAdvertisement={setEditingAdvertisement}
								fetchAdvertisements={fetchAdvertisements}
							/>
							<div className="overflow-auto">
								<StyledTable>
									<thead>
										<tr>
											{columns.map(column => (
												<th key={column.name}>{column.label}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{advertisements.length === 0 && (
											<tr>
												<td colSpan={4}>No advertisements</td>
											</tr>
										)}
										{advertisements
											.filter(advertisement => filterAdvertisements(advertisement))
											.sort((a, b) => {
												return a.created_at > b.created_at ? -1 : 1;
											})
											// .filter(advertisement => advertisement.name === searchTerm)
											.map((advertisement: AdvertisementInterface) => (
												<tr
													style={{
														cursor: 'pointer',
													}}
													key={advertisement.advertisementID}
													onClick={(): void => handleEdit(advertisement)}
												>
													{columns.map(column => (
														<td key={column.name}>
															{column.render
																? column.render(advertisement)
																: advertisement[column.name]}
														</td>
													))}
												</tr>
											))}
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

export default Advertisements;
