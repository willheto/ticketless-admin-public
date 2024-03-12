const setupAPI = () => {
	switch (process.env.NODE_ENV) {
		case 'local':
			return 'http://192.168.33.10';
		case 'development':
			return 'https://dev-api.ticketless.fi';
		case 'production':
			return 'https://api.ticketless.fi';
		default:
			return 'http://192.168.33.10';
	}
};

const setupApp = () => {
	switch (process.env.NODE_ENV) {
		case 'local':
			return 'http://localhost:9001';
		case 'development':
			return 'https://dev-app.ticketless.fi';
		case 'production':
			return 'https://app.ticketless.fi';
		default:
			return 'https://app.ticketless.fi';
	}
};

const setupEventCalendar = () => {
	switch (process.env.NODE_ENV) {
		case 'local':
			return 'http://localhost:9003/';
		case 'development':
			return 'https://dev-event-calendar.ticketless.fi/';
		case 'production':
			return 'https://event-calendar.ticketless.fi';
		default:
			return 'http://localhost:9003/';
	}
};

const API_BASE_URL = JSON.stringify(setupAPI());
const APP_BASE_URL = JSON.stringify(setupApp());
const EVENT_CALENDAR_URL = JSON.stringify(setupEventCalendar());
export default {
	API_BASE_URL,
	EVENT_CALENDAR_URL,
	APP_BASE_URL,
};
