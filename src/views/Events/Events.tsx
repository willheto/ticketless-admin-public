import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../components/Page/Page';
import api from '@src/api';
import { Button } from 'react-bootstrap';
import EventForm from './EventForm';
import { Loading } from '@src/components/Loading/Loading';
import SearchBar from '@src/components/SearchBar/SearchBar';
import { useUser } from '@src/context/UserContext';
import { StyledTable } from '@src/components/Table/Table';
import { formatDate, utcStringToLocalDate } from '@src/utils/dateUtils';

const Events = (): JSX.Element => {
	const [events, setEvents] = React.useState<EventInterface[]>([]);
	const [editingEvent, setEditingEvent] = useState<EventInterface | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const { user } = useUser();

	const fetchEvents = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		try {
			let response: EventInterface[] = [];
			if (!user) return;
			if (user.userType === 'superadmin') {
				response = await api.events.getAllEvents();
			} else {
				if (user?.organizationID) {
					response = await api.events.getOrganizationEvents();
				}
			}

			if (response) {
				setEvents(response);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	React.useEffect(() => {
		if (user) {
			fetchEvents();
		}
	}, [fetchEvents, user]);

	const handleEdit = (event: EventInterface): void => {
		setEditingEvent(event);
	};

	const filterEvents = (event: EventInterface): boolean => {
		return (
			event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.type.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	useEffect(() => {
		const events = document.getElementById('events');
		setTimeout((): void => {
			events?.classList.remove('fade-in');
			events?.classList.add('fade-over');
		}, 100);
	}, []);

	const columns = [
		{
			name: 'name',
			label: 'Name',
		},
		{
			name: 'isPublic',
			label: 'Public',
			render: (event: EventInterface): JSX.Element => {
				return <span>{event.isPublic ? 'Yes' : 'No'}</span>;
			},
		},
		{
			name: 'status',
			label: 'Status',
			render: (event: EventInterface): JSX.Element => {
				const status = event.status.charAt(0).toUpperCase() + event.status.slice(1);
				return <span>{status}</span>;
			},
		},
		{
			name: 'location',
			label: 'Location',
		},
		{
			name: 'type',
			label: 'Type',
			render: (event: EventInterface): JSX.Element => {
				return (
					<span>
						{event.type === 'anniversary' && 'Vuosijuhla'}
						{event.type === 'sitsFest' && 'Sitsit'}
						{event.type === 'sillis' && 'Sillis'}
						{event.type === 'party' && 'Bileet'}
						{event.type === 'excursion' && 'Excursio'}
						{event.type === 'boatCruise' && 'Risteily'}
						{event.type === 'approbatur' && 'Appro'}
						{event.type === 'pubCrawl' && 'Baarikierros'}
						{event.type === 'freshmanEvent' && 'Fuksitapahtuma'}
						{event.type === 'other' && 'Muu'}
					</span>
				);
			},
		},
		{
			name: 'date',
			label: 'Date',
			render: (event: EventInterface): JSX.Element => {
				return <span>{formatDate(utcStringToLocalDate(event.date))}</span>;
			},
		},
		{
			name: 'created_at',
			label: 'Created At',
			render: (event: EventInterface): JSX.Element => {
				return <span>{formatDate(utcStringToLocalDate(event.created_at), 'dateTime')}</span>;
			},
		},
		{
			name: 'updated_at',
			label: 'Updated At',
			render: (event: EventInterface): JSX.Element => {
				if (event.updated_at) {
					return <span>{formatDate(utcStringToLocalDate(event.updated_at), 'dateTime')}</span>;
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
					<Page.Title>Events</Page.Title>
					<Button className="btn-pink" onClick={(): void => setEditingEvent(null)}>
						Create Event
					</Button>
				</div>

				<Page.Content className="fade-in" id="events">
					{isLoading ? (
						<div className="h-100 d-flex justify-content-center align-items-center">
							<Loading text="Fetching events..." />
						</div>
					) : (
						<div className="d-flex flex-column gap-2 mt-2">
							<SearchBar setSearchTerm={setSearchTerm} />
							<EventForm
								editingEvent={editingEvent}
								setEditingEvent={setEditingEvent}
								fetchEvents={fetchEvents}
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
										{events.length === 0 && (
											<tr>
												<td colSpan={4}>No events</td>
											</tr>
										)}
										{events
											.filter(event => filterEvents(event))
											.sort((a, b) => {
												return a.created_at > b.created_at ? -1 : 1;
											})
											// .filter(event => event.name === searchTerm)
											.map((event: EventInterface) => (
												<tr
													style={{
														cursor: 'pointer',
													}}
													key={event.eventID}
													onClick={(): void => handleEdit(event)}
												>
													{columns.map(column => (
														<td key={column.name}>
															{column.render ? column.render(event) : event[column.name]}
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

export default Events;
