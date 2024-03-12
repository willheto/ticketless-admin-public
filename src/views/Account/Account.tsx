import api from '@src/api';
import Page from '@src/components/Page/Page';
import { useUser } from '@src/context/UserContext';
import React, { useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ChangePassword from './ChangePassword';
import { toast } from 'react-toastify';

const Account = (): JSX.Element | null => {
	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
	const [showPasswordChangeModal, setShowPasswordChangeModal] = React.useState<boolean>(false);

	useEffect(() => {
		const account = document.getElementById('account');
		setTimeout((): void => {
			account?.classList.remove('fade-in');
			account?.classList.add('fade-over');
		}, 100);
	}, []);

	const {
		register,
		handleSubmit,
		formState: { dirtyFields },
	} = useForm();

	const { user } = useUser();

	const saveSettings = async (data: Partial<UserInterface>): Promise<void> => {
		try {
			setIsSubmitting(true);

			const dirtyData = Object.keys(dirtyFields).reduce((acc, key) => {
				acc[key] = data[key];
				return acc;
			}, {} as Partial<UserInterface>);
			const payload = {
				userToUpdate: user?.userID,
				...dirtyData,
			};

			await api.users.updateUser(payload);
			toast('Settings saved');
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user) return null;

	return (
		<Page>
			<Modal show={showPasswordChangeModal} onHide={() => setShowPasswordChangeModal(false)} centered>
				<ChangePassword onSuccess={() => setShowPasswordChangeModal(false)} />
			</Modal>
			<div className="container pb-4" style={{ maxWidth: '700px' }}>
				<div className="d-flex justify-content-between align-items-center w-100">
					<Page.Title>Account</Page.Title>
				</div>

				<Page.Content className="fade-in" id="account">
					<Form
						className="h-100 d-flex flex-column"
						style={{ marginTop: '15px' }}
						onSubmit={handleSubmit(saveSettings)}
					>
						<div className="overflow-auto flex-fill gap-3 d-flex flex-column mb-3">
							<Form.Group className="required">
								<Form.Label>Email Address</Form.Label>
								<Form.Control
									type="email"
									{...register('email', {
										required: true,
									})}
									defaultValue={user.email}
								/>
							</Form.Group>
						</div>

						<Form.Group className="mt-3 d-flex gap-2">
							<Button
								className="btn-pink"
								type="submit"
								disabled={isSubmitting || Object.keys(dirtyFields).length === 0}
							>
								{isSubmitting ? 'Saving...' : 'Save'}
							</Button>
							<Button className="btn-secondary" onClick={() => setShowPasswordChangeModal(true)}>
								Change Password
							</Button>
						</Form.Group>
					</Form>
				</Page.Content>
			</div>
		</Page>
	);
};

export default Account;
