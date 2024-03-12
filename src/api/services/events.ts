import BaseService from './base';
import axiosInstance from '../axiosInstance';

class EventsService extends BaseService<EventInterface> {
	getEventByTicketID = async (ticketID: number) => {
		const response = await axiosInstance.get(`events/ticket/${ticketID}`);
		return response;
	};

	getOrganizationEvents = async () => {
		const response = await axiosInstance.get(`admin/events`);
		// @ts-expect-error - response type is correct
		return response.events;
	};

	getAllEvents = async () => {
		const response = await axiosInstance.get('superadmin/events');
		// @ts-expect-error - response type is correct
		return response.events;
	};
}

const events = new EventsService({
	serviceURL: `events`,
	keyParameter: 'eventID',
	crudResponseObject: 'event',
});

export default events;
