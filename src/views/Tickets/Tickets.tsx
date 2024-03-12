import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../components/Page/Page';
import api from '@src/api';
import { Loading } from '@src/components/Loading/Loading';
import SearchBar from '@src/components/SearchBar/SearchBar';
import { useUser } from '@src/context/UserContext';
import { StyledTable } from '@src/components/Table/Table';
import { formatDate, utcStringToLocalDate } from '@src/utils/dateUtils';
import TicketForm from './TicketForm';

const Tickets = (): JSX.Element => {
	const [tickets, setTickets] = React.useState<TicketInterface[]>([]);
	const [editingTicket, setEditingTicket] = useState<TicketInterface | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const { user } = useUser();

	const fetchTickets = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		try {
			let response;
			if (!user) return;
			if (user.userType === 'superadmin') {
				response = await api.tickets.getAll();
			} else {
				if (user?.organizationID) {
					response = await api.tickets.getAllByOrganizationID(user?.organizationID);
				}
			}
			setTickets(response);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	React.useEffect(() => {
		if (user) {
			fetchTickets();
		}
	}, [fetchTickets, user]);

	const handleEdit = (ticket: TicketInterface): void => {
		setEditingTicket(ticket);
	};

	const filterTickets = (ticket: TicketInterface): boolean => {
		return (
			ticket.header?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	useEffect(() => {
		const tickets = document.getElementById('tickets');
		setTimeout((): void => {
			tickets?.classList.remove('fade-in');
			tickets?.classList.add('fade-over');
		}, 100);
	}, []);

	const columns = [
		{
			name: 'header',
			label: 'Header',
		},
		{
			name: 'description',
			label: 'Description',
			render: (ticket: TicketInterface): JSX.Element => {
				if (!ticket.description) {
					return <span>-</span>;
				}
				return <span>{ticket.description}</span>;
			},
		},
		{
			name: 'price',
			label: 'Price',
			render: (ticket: TicketInterface): JSX.Element => {
				return <span>{ticket.price} €</span>;
			},
		},
		{
			name: 'quantity',
			label: 'Quantity',
		},
		{
			name: 'requiresMembership',
			label: 'Requires Membership',
			render: (ticket: TicketInterface): JSX.Element => {
				return <span>{ticket.requiresMembership ? 'Yes' : 'No'}</span>;
			},
		},
		{
			name: 'association',
			label: 'Association',
			render: (ticket: TicketInterface): JSX.Element => {
				if (!ticket.association) {
					return <span>-</span>;
				}
				return <span>{ticket.association}</span>;
			},
		},
		{
			name: 'created_at',
			label: 'Created At',
			render: (ticket: TicketInterface): JSX.Element => {
				return <span>{formatDate(utcStringToLocalDate(ticket.created_at), 'dateTime')}</span>;
			},
		},
		{
			name: 'updated_at',
			label: 'Updated At',
			render: (ticket: TicketInterface): JSX.Element => {
				if (ticket.updated_at) {
					return <span>{formatDate(utcStringToLocalDate(ticket.updated_at), 'dateTime')}</span>;
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
					<Page.Title>Tickets</Page.Title>
				</div>

				<Page.Content className="fade-in" id="tickets">
					{isLoading ? (
						<div className="h-100 d-flex justify-content-center align-items-center">
							<Loading text="Fetching tickets..." />
						</div>
					) : (
						<div className="d-flex flex-column gap-2 mt-2">
							<SearchBar setSearchTerm={setSearchTerm} />
							<TicketForm
								editingTicket={editingTicket}
								setEditingTicket={setEditingTicket}
								fetchTickets={fetchTickets}
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
										{tickets.length === 0 && (
											<tr>
												<td colSpan={4}>No tickets</td>
											</tr>
										)}
										{tickets
											.filter(ticket => filterTickets(ticket))
											.sort((a, b) => {
												return a.created_at > b.created_at ? -1 : 1;
											})
											.map((ticket: TicketInterface) => (
												<tr
													style={{
														cursor: 'pointer',
													}}
													key={ticket.ticketID}
													onClick={(): void => handleEdit(ticket)}
												>
													{columns.map(column => (
														<td key={column.name}>
															{column.render
																? column.render(ticket)
																: ticket[column.name]}
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

export default Tickets;
