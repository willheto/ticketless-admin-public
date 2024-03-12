import api from '@src/api';
import React, { useCallback, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const FileForm = ({ editingFile, setIsEditingFile, refetch }): JSX.Element => {
	const [isRemoving, setIsRemoving] = React.useState<boolean>(false);
	const file = editingFile;

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { dirtyFields },
	} = useForm({
		defaultValues:
			file === null
				? {
						fileName: '',
						filePath: '',
					}
				: {
						...file,
					},
	});

	useEffect(() => {
		reset(
			file === null
				? {
						fileName: '',
						filePath: '',
					}
				: {
						...file,
					},
		);
	}, [file, reset]);

	const handleSave = async (data: Partial<FileInterface>): Promise<void> => {
		try {
			let payload: Partial<FileInterface> = {};

			if (file?.fileID) {
				const dirtyKeys = Object.keys(dirtyFields);

				// update only dirty fields
				if (dirtyKeys.length) {
					for (const key of dirtyKeys) {
						payload[key] = data[key];
					}
				}

				payload['fileID'] = file.fileID;
			} else {
				payload = data;
			}

			await api.files.save(payload);
			refetch();
			setIsEditingFile(undefined);
			toast.success('File saved successfully');
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			if (file?.fileID) {
				await api.files.deleteSingle(file.fileID);
			}
			setIsEditingFile(undefined);
			refetch();
			toast.success('File deleted successfully');
			setIsRemoving(false);
		} catch (error) {
			console.error(error);
		}
	};

	const getBase64 = useCallback(async (file: File): Promise<string> => {
		try {
			const reader = new FileReader();
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

	const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
		noDrag: true,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/jpg': [],
			'image/svg': [],
			'image/webp': [],
		},
	});

	const onUpload = useCallback(async (): Promise<void> => {
		try {
			const base64: string = await getBase64(acceptedFiles[0]);
			setValue('fileBase64', base64, { shouldDirty: true });
		} catch (error) {
			console.error(error);
		}
	}, [acceptedFiles, setValue, getBase64]);

	useEffect(() => {
		if (acceptedFiles.length > 0) {
			onUpload();
		}
	}, [acceptedFiles, onUpload]);

	return (
		<>
			<Modal show={isRemoving} onHide={(): void => setIsRemoving(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Remove file</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<span>Are you sure you want to remove file {file?.name}?</span>
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
				show={file !== undefined}
				onHide={(): void => setIsEditingFile(undefined)}
				backdrop="static"
				keyboard={false}
				size="lg"
				centered
			>
				<Form onSubmit={handleSubmit(handleSave)}>
					<Modal.Header closeButton>
						<Modal.Title>{file?.name || 'New file'}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="d-flex flex-column gap-2">
						<Form.Group className="required">
							<Form.Label>File name</Form.Label>
							<Form.Control {...register('fileName', { required: true })} />
						</Form.Group>
						<Form.Label>{file?.fileID || watch('fileBase64') ? 'Preview' : 'Upload file'}</Form.Label>
						{file?.fileID ? (
							<img src={file.filePath} alt={file.fileName} style={{ width: '50%' }} />
						) : watch('fileBase64') ? (
							<img src={watch('fileBase64')} alt={'preview-image'} style={{ width: '50%' }} />
						) : (
							<StyledSection>
								<StyledDropArea {...getRootProps({ className: 'dropzone' })}>
									<input {...getInputProps()} />
									<p>Click to select file</p>
								</StyledDropArea>
								<aside>
									<div className="d-flex flex-column">
										<Form.Text className="text-muted">
											Allowed filetypes: .jpg, .jpeg, .png, .gif, .svg, .webp
										</Form.Text>
										<Form.Text className="text-muted">Maximum filesize: 10 MB</Form.Text>
									</div>
								</aside>
							</StyledSection>
						)}
					</Modal.Body>
					<Modal.Footer className="justify-content-between">
						<div className="d-flex gap-2">
							<Button className="btn-pink" type="submit">
								Save
							</Button>
							<Button variant="secondary" onClick={(): void => setIsEditingFile(undefined)}>
								Cancel
							</Button>
						</div>
						{file?.fileID && (
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

const StyledSection = styled.section``;
const StyledDropArea = styled.div`
	cursor: pointer;
	border: 1px dashed #ccc;
	border-radius: 5px;
	padding: 20px;
	text-align: center;

	&:hover {
		background-color: #f8f9fa;
	}
`;

export default FileForm;
