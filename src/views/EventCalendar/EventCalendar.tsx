import React, { useEffect } from 'react';
import Page from '../../components/Page/Page';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useUser } from '@src/context/UserContext';

const EventCalendar = (): JSX.Element => {
	const { user } = useUser();
	useEffect(() => {
		const eventCalendar = document.getElementById('event-calendar');
		setTimeout((): void => {
			eventCalendar?.classList.remove('fade-in');
			eventCalendar?.classList.add('fade-over');
		}, 100);
	}, []);

	const calendarUrl = user?.organizationID
		? `${EVENT_CALENDAR_URL}/?organizationID=${user?.organizationID}`
		: EVENT_CALENDAR_URL;
	const handleEmbed = (): void => {
		navigator.clipboard.writeText(calendarUrl);
		toast.success('Embed URL copied to clipboard');
	};

	return (
		<Page>
			<div className="container pb-4">
				<div className="d-flex justify-content-between align-items-center w-100">
					<Page.Title>Event Calendar</Page.Title>
					<Button className="btn-pink" onClick={handleEmbed}>
						Embed
					</Button>
				</div>

				<Page.Content className="fade-in mt-4" id="event-calendar">
					<iframe src={calendarUrl} width="100%" height="1000px"></iframe>
				</Page.Content>
			</div>
		</Page>
	);
};

export default EventCalendar;
