import { Modal, Button, Form } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@src/api';
import Select from 'react-select';
import { useUser } from '@src/context/UserContext';
import { ErrorMessage } from '@hookform/error-message';
import associations from '@src/assets/associations.json';
import { toast } from 'react-toastify';

type PropTypes = {
	editingTicket: TicketInterface | null | undefined;
	setEditingTicket: React.Dispatch<React.SetStateAction<TicketInterface | null | undefined>>;
	fetchTickets: () => void;
};

const TicketForm = (props: PropTypes): JSX.Element | null => {
	const { editingTicket, setEditingTicket, fetchTickets } = props;
	const ticket = editingTicket;
	const [isRemoving, setIsRemoving] = React.useState<boolean>(false);

	const { user } = useUser();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, dirtyFields },
	} = useForm({
		defaultValues: {
			...ticket,
		},
	});

	const sellingWatch = watch('isSelling');
	const associationWatch = watch('association');

	const customFilter = (
		option: {
			label: string;
			value: string;
		},
		inputValue: string,
	): boolean => {
		// Always show the option with value 'always-visible'
		if (option.value === 'other') {
			return true;
		}

		// Default filtering behavior for other options
		return option.label.toLowerCase().includes(inputValue.toLowerCase());
	};

	useEffect(() => {
		reset({
			...ticket,
		});
	}, [ticket, reset]);

	const handleSave = async (data: Partial<TicketInterface>): Promise<void> => {
		try {
			let payload: Partial<TicketInterface> = {};

			if (ticket?.ticketID) {
				const dirtyKeys = Object.keys(dirtyFields);
				// update only dirty fields
				if (dirtyKeys.length) {
					for (const key of dirtyKeys) {
						payload[key] = data[key];
					}
				}

				payload['ticketID'] = ticket.ticketID;
			} else {
				payload = {
					...data,
				};
			}

			await api.tickets.save(payload);
			setEditingTicket(undefined);
			fetchTickets();
			toast.success('Ticket updated successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			if (ticket?.ticketID && user?.userID) await api.tickets.deleteSingle(ticket.ticketID);
			setEditingTicket(undefined);
			fetchTickets();
			toast.success('Ticket deleted successfully');
		} catch (error) {
			console.error(error);
		}
	};

	if (ticket === undefined) return null;
	return (
		<>
			<Modal show={isRemoving} onHide={(): void => setIsRemoving(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Remove ticket</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>Are you sure you want to remove ticket {ticket?.header}?</span>
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
				show={ticket !== undefined}
				onHide={(): void => setEditingTicket(undefined)}
				backdrop="static"
				keyboard={false}
				size="lg"
				centered
			>
				<Form onSubmit={handleSubmit(handleSave)}>
					<Modal.Header closeButton>
						<Modal.Title>{ticket?.header || 'New ticket'}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="d-flex flex-column gap-2">
						<Form.Group className="mt-2 required">
							<Form.Check
								id="selling"
								inline
								disabled
								label={<label htmlFor="selling">Selling</label>}
								type="radio"
								defaultChecked={ticket?.isSelling === true}
							/>
							<Form.Check
								id="buying"
								inline
								disabled
								label={<label htmlFor="buying">Buying</label>}
								type="radio"
								defaultChecked={ticket?.isSelling === false}
							/>
						</Form.Group>
						<Form.Text className="muted">
							You cannot change the type (selling/buying) of the ticket after it has been created
						</Form.Text>

						{sellingWatch ? (
							<Form.Group className="mb-2 required">
								<Form.Label>Price per ticket</Form.Label>
								<Form.Control
									type="number"
									min="0"
									max={1000}
									{...register('price', {
										required: 'Price is required',
									})}
								/>

								<ErrorMessage
									errors={errors}
									name="price"
									render={({ message }): JSX.Element => <p className="text-danger mb-0">{message}</p>}
								/>
							</Form.Group>
						) : null}
						<Form.Group className="mb-2 required">
							<Form.Label>Ticket quantity (1-5)</Form.Label>
							<Form.Control
								type="number"
								min="1"
								max="5"
								{...register('quantity', {
									min: {
										value: 1,
										message: 'Quantity must be at least 1',
									},
									required: 'Quantity is required',
								})}
							/>
							<ErrorMessage
								errors={errors}
								name="quantity"
								render={({ message }): JSX.Element => <p className="text-danger mb-0">{message}</p>}
							/>
						</Form.Group>
						<Form.Group className="mb-2 required">
							<Form.Label>Header</Form.Label>
							<Form.Control
								maxLength={50}
								{...register('header', {
									required: 'Header is required',
								})}
							/>
							<ErrorMessage
								errors={errors}
								name="header"
								render={({ message }): JSX.Element => <p className="text-danger mb-0">{message}</p>}
							/>
						</Form.Group>
						<Form.Group className="mb-2">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								maxLength={200}
								{...register('description', {
									required: false,
								})}
							/>
						</Form.Group>
						{sellingWatch ? (
							<Form.Group className="mb-3">
								<label className="w-100" htmlFor="requiresMembership">
									<Form.Check
										label="Requires student association membership"
										id="requiresMembership"
										{...register('requiresMembership', {
											required: false,
										})}
									/>
								</label>

								{watch('requiresMembership') && (
									<>
										<Form.Label className="required">Student association</Form.Label>
										<Select
											{...register('association', {
												required: 'Association is required',
											})}
											filterOption={customFilter}
											menuPlacement="top"
											onChange={(e: { label: string; value: string } | null): void => {
												if (e !== null && e.value !== undefined) {
													setValue('association', e.value.toString(), {
														shouldValidate: true,
														shouldDirty: true,
													});
												} else {
													setValue('association', '', {
														shouldValidate: true,
														shouldDirty: true,
													});
												}
											}}
											options={[
												...associations.map((type: string) => ({
													label: type,
													value: type,
												})),
												{
													label: 'Muu järjestö / ei löydy listasta',
													value: 'other',
												},
											]}
											value={
												watch('association') !== ''
													? {
															label:
																watch('association') === 'other'
																	? 'Muu järjestö / ei löydy listasta'
																	: watch('association'),

															value: watch('association'),
														}
													: null
											}
											placeholder="Select association"
										/>
										<ErrorMessage
											errors={errors}
											name="association"
											render={({ message }): JSX.Element => (
												<p className="text-danger mb-0">{message}</p>
											)}
										/>
									</>
								)}
								{associationWatch === 'other' && (
									<label className="mt-1">Please specify the association</label>
								)}
							</Form.Group>
						) : null}
					</Modal.Body>
					<Modal.Footer className="justify-content-between">
						<div className="d-flex gap-2">
							<Button className="btn-pink" type="submit">
								Save
							</Button>
							<Button variant="secondary" onClick={(): void => setEditingTicket(undefined)}>
								Cancel
							</Button>
						</div>
						{ticket?.ticketID && (
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

export default TicketForm;
