import BaseService from './base';
import axiosInstance from '../axiosInstance';

class TicketsService extends BaseService<TicketInterface> {
	getTicketByTicketID = async (ticketID: number) => {
		const response = await axiosInstance.get(`tickets/ticket/${ticketID}`);
		return response;
	};

	getAllByOrganizationID = async (organizationID: number) => {
		const response = await axiosInstance.get(
			`organizations/${organizationID}/tickets`,
		);
		// @ts-expect-error - response type is correct
		return response.tickets;
	};
}

const tickets = new TicketsService({
	serviceURL: `tickets`,
	keyParameter: 'ticketID',
	crudResponseObject: 'ticket',
});

export default tickets;
