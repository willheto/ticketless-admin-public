import { Modal, Button, Form } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@src/api';
import { towns } from '@src/assets/FinnishTowns';
import { toast } from 'react-toastify';

type PropTypes = {
	editingOrganization: OrganizationInterface | null | undefined;
	setIsEditingOrganization: React.Dispatch<React.SetStateAction<OrganizationInterface | null | undefined>>;
	refetch: () => void;
};

const OrganizationForm = (props: PropTypes): JSX.Element => {
	const { editingOrganization, setIsEditingOrganization, refetch } = props;
	const organization = editingOrganization;
	const [isRemoving, setIsRemoving] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { dirtyFields },
	} = useForm({
		defaultValues:
			organization === null
				? {
						name: '',
						license: 'free',
						location: '',
					}
				: {
						...organization,
					},
	});

	useEffect(() => {
		reset(
			organization === null
				? {
						name: '',
						license: 'free',
						location: '',
					}
				: {
						...organization,
					},
		);
	}, [organization, reset]);

	const handleSave = async (data: Partial<OrganizationInterface>): Promise<void> => {
		try {
			let payload: Partial<OrganizationInterface> = {};

			if (organization?.organizationID) {
				const dirtyKeys = Object.keys(dirtyFields);

				// update only dirty fields
				if (dirtyKeys.length) {
					for (const key of dirtyKeys) {
						payload[key] = data[key];
					}
				}

				payload['organizationID'] = organization.organizationID;
			} else {
				payload = data;
			}

			await api.organizations.save(payload);
			refetch();
			setIsEditingOrganization(undefined);
			toast.success('Organization saved successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			if (organization?.organizationID) {
				await api.organizations.deleteSingle(organization.organizationID);
			}
			setIsEditingOrganization(undefined);
			refetch();
			toast.success('Organization deleted successfully');
			setIsRemoving(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Modal show={isRemoving} onHide={(): void => setIsRemoving(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Remove organization</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>Are you sure you want to remove organization {organization?.name}?</span>
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
				show={organization !== undefined}
				onHide={(): void => setIsEditingOrganization(undefined)}
				backdrop="static"
				keyboard={false}
				size="lg"
				centered
			>
				<Form onSubmit={handleSubmit(handleSave)}>
					<Modal.Header closeButton>
						<Modal.Title>{organization?.name || 'New organization'}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="d-flex flex-column gap-2">
						<Form.Group className="required">
							<Form.Label>Name</Form.Label>
							<Form.Control maxLength={100} {...register('name', { required: true })} />
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>License</Form.Label>
							<Form.Select {...register('license', { required: true })}>
								<option value="free">Free</option>
								<option value="basic">Basic</option>
								<option value="pro">Pro</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="required">
							<Form.Label>Location</Form.Label>
							<Form.Select
								{...register('location', {
									required: true,
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
							<Button variant="secondary" onClick={(): void => setIsEditingOrganization(undefined)}>
								Cancel
							</Button>
						</div>
						{organization?.organizationID && (
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

export default OrganizationForm;
