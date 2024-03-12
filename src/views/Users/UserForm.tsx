import { Modal, Button, Form } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@src/api';
import { towns } from '@src/assets/FinnishTowns';
import { toast } from 'react-toastify';

type PropTypes = {
	editingUser: UserInterface | null | undefined;
	setEditingUser: React.Dispatch<React.SetStateAction<UserInterface | null | undefined>>;
	refetch: () => void;
	organizations: OrganizationInterface[];
};

const UserForm = (props: PropTypes): JSX.Element | null => {
	const { editingUser, setEditingUser, refetch, organizations } = props;
	const user = editingUser;
	const [isRemoving, setIsRemoving] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { dirtyFields },
	} = useForm({
		defaultValues: {
			...user,
		},
	});

	useEffect(() => {
		reset({
			...user,
		});
	}, [user, reset]);

	const handleSave = async (data: Partial<UserInterface>): Promise<void> => {
		try {
			let payload: Partial<UserInterface> = {};

			if (user?.userID) {
				const dirtyKeys = Object.keys(dirtyFields);
				// update only dirty fields
				if (dirtyKeys.length) {
					for (const key of dirtyKeys) {
						payload[key] = data[key];
					}
				}

				payload['userToUpdate'] = user.userID;
			} else {
				payload = {
					...data,
				};
			}

			await api.users.updateUser(payload);
			setEditingUser(undefined);
			refetch();
			toast.success('User saved successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			if (user?.userID) await api.users.deleteSingleUser(user.userID);
			setEditingUser(undefined);
			refetch();
			toast.success('User deleted successfully');
		} catch (error) {
			console.error(error);
		}
	};

	if (user === undefined) return null;
	return (
		<>
			<Modal show={isRemoving} onHide={(): void => setIsRemoving(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Remove user</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>
						Are you sure you want to remove user {user?.firstName} {user?.lastName}?
					</span>
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
				show={user !== undefined}
				onHide={(): void => setEditingUser(undefined)}
				backdrop="static"
				keyboard={false}
				size="lg"
				centered
			>
				<Form onSubmit={handleSubmit(handleSave)}>
					<Modal.Header closeButton>
						<Modal.Title>{(user && user.firstName + ' ' + user.lastName) || 'New user'}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="d-flex flex-column gap-2">
						<Form.Group className="required">
							<Form.Label>First name</Form.Label>
							<Form.Control maxLength={100} {...register('firstName', { required: true })} />
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>Last name</Form.Label>
							<Form.Control maxLength={100} {...register('lastName', { required: true })} />
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>Email</Form.Label>
							<Form.Control maxLength={100} type="email" {...register('email', { required: true })} />
						</Form.Group>
						<Form.Group>
							<Form.Label>User type</Form.Label>
							<Form.Select {...register('userType', { required: true })}>
								<option value={'user'}>User</option>
								<option value={'admin'}>Admin</option>
								<option value={'superadmin'}>Superadmin</option>
							</Form.Select>
						</Form.Group>
						{(watch('userType') === 'admin' || watch('userType') === 'superadmin') && (
							<Form.Group>
								<Form.Label>Organization</Form.Label>
								<Form.Select
									{...register('organizationID', {
										required: !(watch('userType') === 'user'),
										setValueAs: (value: string) => {
											if (value === '-1') return null;
											return value;
										},
									})}
								>
									<option value={-1}>No organization</option>
									{organizations.map((organization, index) => (
										<option key={index} value={organization.organizationID}>
											{organization.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						)}
						<Form.Group>
							<Form.Label>Phone number</Form.Label>
							<Form.Control
								type="tel"
								maxLength={20}
								{...register('phoneNumber', {
									required: false,
								})}
							/>
						</Form.Group>
						<Form.Group className="d-flex flex-column">
							<Form.Label>City</Form.Label>
							<Form.Select
								maxLength={100}
								{...register('city', {
									required: false,
								})}
							>
								{towns.map((town, index) => (
									<option key={index} value={town}>
										{town}
									</option>
								))}
							</Form.Select>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer className="justify-content-between">
						<div className="d-flex gap-2">
							<Button className="btn-pink" type="submit">
								Save
							</Button>
							<Button variant="secondary" onClick={(): void => setEditingUser(undefined)}>
								Cancel
							</Button>
						</div>
						{user?.userID && (
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

export default UserForm;
