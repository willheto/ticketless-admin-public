import { Modal, Button, Form } from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from '@src/api';
import { useUser } from '@src/context/UserContext';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import { towns } from '@src/assets/FinnishTowns';

type PropTypes = {
	editingAdvertisement: AdvertisementInterface | null | undefined;
	setEditingAdvertisement: React.Dispatch<React.SetStateAction<AdvertisementInterface | null | undefined>>;
	fetchAdvertisements: () => void;
};

const AdvertisementForm = (props: PropTypes): JSX.Element | null => {
	const { editingAdvertisement, setEditingAdvertisement, fetchAdvertisements } = props;
	const advertisement = editingAdvertisement;
	const advertisementID = advertisement?.advertisementID;
	const type = advertisement?.type;
	const [isRemoving, setIsRemoving] = React.useState<boolean>(false);

	const { user } = useUser();

	const {
		reset,
		setError,
		setValue,
		handleSubmit,
		register,
		clearErrors,
		formState: { dirtyFields, errors },
	} = useForm({
		defaultValues: {
			...advertisement,
		},
	});

	useEffect(() => {
		reset({
			...advertisement,
		});
		return () => {
			reset();
		};
	}, [advertisement, reset]);

	const editorRef = useRef();

	const handleSave = async (data: Partial<AdvertisementInterface>): Promise<void> => {
		try {
			// @ts-expect-error - editorRef is not initialized
			if (editorRef?.current?.getContent() === '') {
				setError('contentHtml', {
					message: 'Content HTML is required',
				});
				return;
			}
			let payload: Partial<AdvertisementInterface> = {};

			if (advertisement?.advertisementID) {
				const dirtyKeys = Object.keys(dirtyFields);
				// update only dirty fields
				if (dirtyKeys.length) {
					for (const key of dirtyKeys) {
						payload[key] = data[key];
					}
				}

				payload['advertisementID'] = advertisement.advertisementID;
				// @ts-expect-error - editorRef is not initialized
				payload['contentHtml'] = editorRef?.current?.getContent() || '';
			} else {
				payload = {
					...data,
					// @ts-expect-error - editorRef is not initialized
					contentHtml: editorRef?.current?.getContent() || '',
				};
			}

			await api.advertisements.save(payload);
			setEditingAdvertisement(undefined);
			fetchAdvertisements();
			toast.success('Advertisement saved successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			if (advertisement?.advertisementID && user?.userID) {
				await api.advertisements.deleteSingle(advertisement.advertisementID);
			}
			setEditingAdvertisement(undefined);
			fetchAdvertisements();
			toast.success('Advertisement removed successfully');
		} catch (error) {
			console.error(error);
		}
	};

	if (advertisement === undefined) return null;
	return (
		<>
			<Modal show={isRemoving} onHide={(): void => setIsRemoving(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Remove advertisement</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>Are you sure you want to remove advertisement {advertisement?.advertiser}?</span>
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
				show={advertisement !== undefined}
				onHide={(): void => setEditingAdvertisement(undefined)}
				backdrop="static"
				keyboard={false}
				size="lg"
				centered
				enforceFocus={false}
			>
				<Form onSubmit={handleSubmit(handleSave)}>
					<Modal.Header closeButton>
						<Modal.Title>{advertisement?.advertiser || 'New advertisement'}</Modal.Title>
					</Modal.Header>

					<Modal.Body className="d-flex flex-column gap-2">
						{advertisementID && (
							<Form.Group>
								<Form.Label>Analytics:</Form.Label>
								<div className="d-flex gap-2">
									<Form.Label>
										<span style={{ fontWeight: 'normal' }}>Views: </span>
										{advertisement?.views}
									</Form.Label>
									<Form.Label>
										<span style={{ fontWeight: 'normal' }}>Clicks: </span> {advertisement?.clicks}
									</Form.Label>
								</div>
							</Form.Group>
						)}

						<Form.Group className="required">
							<Form.Label>Advertiser</Form.Label>
							<Form.Control maxLength={100} {...register('advertiser', { required: true })} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Redirect on click</Form.Label>
							<Form.Control maxLength={1000} {...register('redirectUrl')} />
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>Type</Form.Label>
							<Form.Select
								{...register('type', {
									onChange: e => {
										if (e.value !== 'local') setValue('location', null, { shouldDirty: true });
									},
								})}
							>
								<option value="global">Global</option>
								<option value="local">Local</option>
								<option value="toast">Toast</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className="required">
							<Form.Label>Location</Form.Label>
							<Form.Select
								disabled={type !== 'local'}
								{...register('location', { required: type === 'local' })}
							>
								{type !== 'local' && <option value={''}>Global</option>}
								{towns.map((town: string) => (
									<option key={town} value={town}>
										{town}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group>
							<Form.Switch id="isActive" {...register('isActive')} type="checkbox" label="Active" />
						</Form.Group>
						<Form.Group>
							<Form.Label>Content HTML</Form.Label>
							<Editor
								// @ts-expect-error - editorRef is not initialized
								ref={editorRef}
								onInit={(evt, editor): void =>
									// @ts-expect-error - editorRef is not initialized
									(editorRef.current = editor)
								}
								onChange={(): void => {
									if (errors.contentHtml) {
										clearErrors('contentHtml');
									}
								}}
								max={20000}
								maxLength={20000}
								apiKey="APIKEYREMOVED"
								init={{
									plugins: 'image',
									// 'ai tinycomments mentions anchor autolink charmap codesample emoticons  lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
									toolbar:
										'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
									tinycomments_mode: 'embedded',
									tinycomments_author: 'Author name',
									forced_root_block: 'div',
									mergetags_list: [
										{
											value: 'First.Name',
											title: 'First Name',
										},
										{ value: 'Email', title: 'Email' },
									],
									ai_request: (request, respondWith) =>
										respondWith.string(
											(): Promise<string> => Promise.reject('See docs to implement AI Assistant'),
										),
								}}
								initialValue={
									advertisement?.contentHtml ||
									'Write advertisement content and add photos here. It will be displayed as is. \n\n To add an image, click the three dots on top right, and paste a link to the image. Dragging an image to this box DOESNT work. \n \nYou can add images to the server by using the Files tab.'
								}
							/>
							{errors.contentHtml && (
								<Form.Text className="text-danger">{errors.contentHtml.message}</Form.Text>
							)}
						</Form.Group>
					</Modal.Body>
					<Modal.Footer className="justify-content-between">
						<div className="d-flex gap-2">
							<Button className="btn-pink" type="submit">
								Save
							</Button>
							<Button variant="secondary" onClick={(): void => setEditingAdvertisement(undefined)}>
								Cancel
							</Button>
						</div>
						{advertisement?.advertisementID && (
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

export default AdvertisementForm;
