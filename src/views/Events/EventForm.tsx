import { Modal, Button, Form } from 'react-bootstrap';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@src/api';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { eventTypes } from '@src/assets/EventTypes';
import { towns } from '@src/assets/FinnishTowns';
import DatePicker, { registerLocale } from 'react-datepicker';
import fi from 'date-fns/locale/fi';
import { useUser } from '@src/context/UserContext';
import { toast } from 'react-toastify';
import { toUtc, utcStringToLocalDate } from '@src/utils/dateUtils';
import { useQuery } from 'react-query';

type PropTypes = {
	editingEvent: EventInterface | null | undefined;
	setEditingEvent: React.Dispatch<React.SetStateAction<EventInterface | null | undefined>>;
	fetchEvents: () => void;
};

const EventForm = (props: PropTypes): JSX.Element | null => {
	const { editingEvent, setEditingEvent, fetchEvents } = props;
	const event = editingEvent;
	registerLocale('fi', fi);
	const [isRemoving, setIsRemoving] = React.useState<boolean>(false);
	const [copyEventLinkText, setCopyEventLinkText] = React.useState<string>('Copy event link');
	const eventStatuses = [
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'scheduled', label: 'Scheduled' },
		{ value: 'redirect', label: 'Redirect' },
	];
	const { user } = useUser();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { dirtyFields },
	} = useForm({
		defaultValues: {
			name: event?.name,
			location: event?.location,
			type: event?.type,
			date: event?.date,
			image: event?.image || null,
			ticketSaleUrl: event?.ticketSaleUrl || null,
			isPublic: event?.isPublic === false ? false : true,
			status: event?.status || 'active',
			activeFrom: event?.activeFrom || null,
			activeTo: event?.activeTo || null,
			ticketMinPrice: event?.ticketMinPrice || null,
			ticketMaxPrice: event?.ticketMaxPrice || null,
			showEventOnCalendar: event?.showEventOnCalendar === false ? false : true,
			redirectCustomText: event?.redirectCustomText || null,
			redirectCustomButtonText: event?.redirectCustomButtonText || null,
			organizationID: event?.organizationID || undefined,
		},
	});
	const dateWatch = watch('date');
	const activeFromWatch = watch('activeFrom');
	const activeToWatch = watch('activeTo');
	const statusWatch = watch('status');

	useEffect(() => {
		reset({
			name: event?.name,
			location: event?.location,
			type: event?.type,
			date: event?.date,
			image: event?.image || null,
			ticketMinPrice: event?.ticketMinPrice || null,
			ticketMaxPrice: event?.ticketMaxPrice || null,
			ticketSaleUrl: event?.ticketSaleUrl || null,
			isPublic: event?.isPublic === false ? false : true,
			status: event?.status || 'active',
			activeFrom: event?.activeFrom || null,
			activeTo: event?.activeTo || null,
			showEventOnCalendar: event?.showEventOnCalendar === false ? false : true,
			redirectCustomText: event?.redirectCustomText || null,
			redirectCustomButtonText: event?.redirectCustomButtonText || null,
			organizationID: event?.organizationID || undefined,
		});
	}, [event, reset]);

	const handleSave = async (data: Partial<EventInterface>): Promise<void> => {
		try {
			let payload: Partial<EventInterface> = {};

			if (event?.eventID) {
				const dirtyKeys = Object.keys(dirtyFields);

				// update only dirty fields
				if (dirtyKeys.length) {
					for (const key of dirtyKeys) {
						payload[key] = data[key];
					}
				}

				payload['eventID'] = event.eventID;
				if (data.image === null) {
					payload['image'] = watch('image');
				}
			} else {
				payload = {
					...data,
					organizationID: user?.organizationID || undefined,
				};
				if (payload.image === null) delete payload.image;
				if (payload.ticketMaxPrice === null) delete payload.ticketMaxPrice;
				if (payload.ticketMinPrice === null) delete payload.ticketMinPrice;
				if (payload.ticketSaleUrl === null) delete payload.ticketSaleUrl;
				if (payload.activeFrom === null) delete payload.activeFrom;
				if (payload.activeTo === null) delete payload.activeTo;
				if (payload.showEventOnCalendar === null) delete payload.showEventOnCalendar;
				if (payload.redirectCustomText === null) delete payload.redirectCustomText;
				if (payload.redirectCustomButtonText === null) delete payload.redirectCustomButtonText;
			}
			await api.events.save(payload);
			setEditingEvent(undefined);
			fetchEvents();
			toast.success('Event saved');
		} catch (error) {
			console.error(error);
		}
	};

	const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
		noDrag: true,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/jpg': [],
			'image/svg': [],
			'image/webp': [],
		},
	});

	type File = {
		lastModified: number;
		name: string;
		path?: string;
		size: number;
		type: string;
		webkitRelativePath: string;
	};

	const copyEventLink = (): void => {
		if (event?.eventID) {
			navigator.clipboard.writeText(`${APP_BASE_URL}/events/${event.eventID}`);
			setCopyEventLinkText('Copied!');
		}
	};

	const getStatusInfo = (status: EventStatus): string => {
		switch (status) {
			case 'active':
				return 'Event is active and visible to users right away.';
			case 'inactive':
				return 'Event is not active nor visible to users.';
			case 'scheduled':
				return 'Event will be visible to users between the starting time and ending time.';
			case 'redirect':
				return "Event will be visible to users but they can't make buying or selling offers, instead they will be redirected to other page.";
		}
	};

	const getBase64 = useCallback(async (file: File): Promise<string> => {
		try {
			const reader = new FileReader();
			//@ts-expect-error This works, but TypeScript doesn't like it
			reader.readAsDataURL(file);
			return new Promise<string>((resolve, reject) => {
				reader.onload = (): void => {
					if (typeof reader.result === 'string') {
						resolve(reader.result);
					} else {
						reject(new Error('Failed to read file as base64.'));
					}
				};
				reader.onerror = (error): void => {
					reject(error);
				};
			});
		} catch (error) {
			console.error(error);
			throw new Error('An error occurred while processing the file.');
		}
	}, []);

	const onUpload = useCallback(async (): Promise<void> => {
		try {
			const base64: string = await getBase64(acceptedFiles[0]);
			setValue('image', base64, { shouldDirty: true });
		} catch (error) {
			console.error(error);
		}
	}, [acceptedFiles, setValue, getBase64]);

	useEffect(() => {
		if (acceptedFiles.length > 0) {
			onUpload();
		}
	}, [acceptedFiles, onUpload]);

	const handleDelete = async (): Promise<void> => {
		try {
			if (event?.eventID && user?.userID) await api.events.deleteSingle(event.eventID);
			setEditingEvent(undefined);
			fetchEvents();
			toast.success('Event removed');
		} catch (error) {
			console.error(error);
		}
	};

	const {
		data: organizations,
	}: {
		data: OrganizationInterface[] | undefined;
	} = useQuery({
		queryKey: ['organizations'],
		queryFn: () => api.organizations.getAll(),
	});

	if (event === undefined) return null;
	return (
		<>
			<Modal show={isRemoving} onHide={(): void => setIsRemoving(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Remove event</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>Are you sure you want to remove event {event?.name}?</span>
				</Modal.Body>
				<Modal.Footer className="justify-content-start">
					<Button className="btn-pink" onClick={handleDelete}>
						Remove
					</Button>
					<Button variant="secondary" onClick={(): void => setIsRemoving(false)}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal
				show={event !== undefined}
				onHide={(): void => setEditingEvent(undefined)}
				backdrop="static"
				keyboard={false}
				size="lg"
				centered
			>
				<Form onSubmit={handleSubmit(handleSave)}>
					<Modal.Header className="d-flex gap-3" closeButton>
						<Modal.Title>{event?.name || 'New event'}</Modal.Title>
						{event?.eventID && (
							<Button onClick={copyEventLink} className="btn-pink">
								{copyEventLinkText}
							</Button>
						)}
					</Modal.Header>
					<Modal.Body className="d-flex flex-column gap-2">
						<Form.Group className="required">
							<Form.Label>Name</Form.Label>
							<Form.Control maxLength={100} {...register('name', { required: true })} />
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>Location</Form.Label>
							<Select
								{...register('location', {
									required: true,
								})}
								onChange={(e: { value: string; label: string } | null): void => {
									if (e?.value) {
										setValue('location', e.value.toString(), {
											shouldDirty: true,
										});
									} else {
										setValue('location', undefined);
									}
								}}
								options={towns.map((town: string) => ({
									label: town,
									value: town,
								}))}
								value={
									watch('location') !== ''
										? {
												label: watch('location'),
												value: watch('location'),
											}
										: null
								}
							/>
						</Form.Group>
						<Form.Group className="d-flex flex-column required">
							<Form.Label>Date</Form.Label>
							<DatePicker
								toUtc
								required
								{...register('date', {
									required: true,
								})}
								calendarStartDay={1}
								locale={fi}
								className="form-control"
								dateFormat="dd.MM.yyyy"
								selected={dateWatch ? utcStringToLocalDate(dateWatch) : null}
								onChange={(date: Date): void => {
									setValue('date', toUtc(date), {
										shouldDirty: true,
									});
								}}
							/>
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>Type</Form.Label>
							<Select
								{...register('type', {
									required: true,
								})}
								onChange={(e: { value: string; label: string } | null): void => {
									if (e && e.value) {
										setValue('type', e.value.toString(), {
											shouldDirty: true,
										});
									} else {
										setValue('type', undefined);
									}
								}}
								options={eventTypes.map((eventType: { name: string; displayName: string }) => ({
									label: eventType.displayName,
									value: eventType.name,
								}))}
								value={
									watch('type') !== ''
										? {
												label: eventTypes.find(eventType => eventType.name === watch('type'))
													?.displayName,
												value: watch('type'),
											}
										: null
								}
							/>
						</Form.Group>
						{user?.userType === 'superadmin' && (
							<Form.Group>
								<Form.Label>Organization</Form.Label>
								<Form.Select
									{...register('organizationID', {
										required: false,
										setValueAs: (value: string): number => Number(value),
									})}
								>
									<option value={undefined}>None</option>
									{organizations?.map(organization => (
										<option key={organization.organizationID} value={organization.organizationID}>
											{organization.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						)}
						<Form.Group>
							<Form.Label>Public event</Form.Label>
							<Form.Check type="switch" {...register('isPublic')} />
							<Form.Text>
								When event is not public, it can be accessed only by users with a direct link
							</Form.Text>
						</Form.Group>
						<Form.Group>
							<Form.Label>Show event on calendar</Form.Label>
							<Form.Check type="switch" {...register('showEventOnCalendar')} />
							<Form.Text>When enabled, event will be visible on the calendar.</Form.Text>
						</Form.Group>
						<Form.Group>
							<Form.Label>Status</Form.Label>
							<Form.Select
								{...register('status', {
									required: true,
								})}
							>
								{eventStatuses.map(status => (
									<option key={status.value} value={status.value}>
										{status.label}
									</option>
								))}
							</Form.Select>
							<Form.Text>{getStatusInfo(statusWatch)}</Form.Text>
						</Form.Group>
						{statusWatch === 'redirect' && (
							<>
								<Form.Group className="required">
									<Form.Label>Redirect url</Form.Label>
									<Form.Control
										{...register('ticketSaleUrl', {
											required: statusWatch === 'redirect' ? true : false,
										})}
									/>
									<Form.Text>
										Can be a link to a ticket sale page or any other page you want to redirect the
										user to
									</Form.Text>
								</Form.Group>
								<Form.Group>
									<Form.Label>Custom text to redirect page</Form.Label>
									<Form.Control
										as="textarea"
										maxLength={500}
										{...register('redirectCustomText', {
											required: false,
										})}
										placeholder="This event has official ticket sales still going on, you can go to the ticket sale by pressing the button below"
									/>
									<Form.Text>
										This text will be displayed to the user, when they click the event and navigate
										themselves to the event page
									</Form.Text>
								</Form.Group>
								<Form.Group>
									<Form.Label>Custom redirect button text</Form.Label>
									<Form.Control
										maxLength={100}
										{...register('redirectCustomButtonText', {
											required: false,
										})}
										placeholder="Ticket sale"
									/>
									<Form.Text>This text will be displayed on the redirect button</Form.Text>
								</Form.Group>
							</>
						)}
						{statusWatch === 'scheduled' && (
							<div className="d-flex gap-2">
								<Form.Group className="required d-flex flex-column flex-fill">
									<Form.Label>Starting time</Form.Label>
									<DatePicker
										toUtc
										required
										{...register('activeFrom', {
											required: statusWatch === 'scheduled' ? true : false,
										})}
										calendarStartDay={1}
										locale={fi}
										className="form-control"
										timeIntervals={60}
										dateFormat="dd.MM.yyyy HH:mm"
										showTimeSelect
										selected={activeFromWatch ? utcStringToLocalDate(activeFromWatch) : null}
										onChange={(date: Date): void => {
											setValue('activeFrom', toUtc(date), {
												shouldDirty: true,
											});
										}}
									/>
								</Form.Group>
								<Form.Group className="required d-flex flex-column flex-fill">
									<Form.Label>Ending time</Form.Label>
									<DatePicker
										toUtc
										required
										{...register('activeTo', {
											required: statusWatch === 'scheduled' ? true : false,
										})}
										calendarStartDay={1}
										locale={fi}
										className="form-control"
										showTimeSelect
										timeIntervals={60}
										dateFormat="dd.MM.yyyy HH:mm"
										selected={activeToWatch ? utcStringToLocalDate(activeToWatch) : null}
										onChange={(date: Date): void => {
											setValue('activeTo', toUtc(date), {
												shouldDirty: true,
											});
										}}
									/>
								</Form.Group>
							</div>
						)}
						{/* Add this back if someone needs it, probably just causes confusion */}
						{/* <Form.Group>
							<Form.Label>Ticket min price €</Form.Label>
							<Form.Control
								type="number"
								min="0"
								max="1000"
								{...register('ticketMinPrice', {
									required: false,
								})}
							/>
						</Form.Group> */}
						<Form.Group>
							<Form.Label>Ticket max price €</Form.Label>
							<Form.Control
								type="number"
								min="0"
								max="1000"
								{...register('ticketMaxPrice', {
									required: false,
								})}
							/>
						</Form.Group>

						<div className="d-flex flex-column gap-2">
							<Form.Label>Event banner</Form.Label>
							{watch('image') !== null && (
								<img src={watch('image') || ''} alt="Event banner" className="w-50" />
							)}
							<div className="d-flex justify-content-between gap-2">
								{watch('image') !== null && (
									<Button
										className="btn-secondary w-100"
										onClick={(): void => {
											setValue('image', null),
												{
													shouldDirty: true,
													shouldValidate: true,
												};
										}}
									>
										Delete event banner
									</Button>
								)}
								<div
									{...getRootProps()}
									style={{
										width: 'max-content',
									}}
									className="w-100"
								>
									<input {...getInputProps()} />
									<Button className="btn-pink w-100">Upload event banner</Button>
								</div>
							</div>
							{acceptedFiles.length > 0 && (
								<div className="overflow-hidden text-truncate">{acceptedFiles[0].name}</div>
							)}
							{fileRejections.length > 0 && <div className="text-danger">File type not supported</div>}
						</div>
					</Modal.Body>
					<Modal.Footer className="justify-content-between">
						<div className="d-flex gap-2">
							<Button className="btn-pink" type="submit">
								Save
							</Button>
							<Button variant="secondary" onClick={(): void => setEditingEvent(undefined)}>
								Cancel
							</Button>
						</div>
						{event?.eventID && (
							<Button variant="outline-danger" onClick={(): void => setIsRemoving(true)}>
								Delete
							</Button>
						)}
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

export default EventForm;
