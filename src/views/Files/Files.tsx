import Page from '@src/components/Page/Page';
import SearchBar from '@src/components/SearchBar/SearchBar';
import { StyledTable } from '@src/components/Table/Table';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import api from '@src/api';
import { toast } from 'react-toastify';
import FileForm from './FileForm';

const Files = (): JSX.Element => {
	const [isEditingFile, setIsEditingFile] = React.useState<FileInterface | null | undefined>(undefined);
	const [searchTerm, setSearchTerm] = React.useState<string>('');


	const copyFilePath = (filePath: string): void => {
		navigator.clipboard.writeText(filePath);
		toast.success('File url copied to clipboard');
	};

	const columns = [
		{
			name: 'name',
			label: 'Name',
			render: (file: FileInterface): string => {
				return file.fileName;
			},
		},
		{
			name: 'filePath',
			label: 'File Path',
			render: (file: FileInterface): JSX.Element => {
				return (
					<Button
						className="btn-pink"
						onClick={(e): void => {
							e.stopPropagation();
							copyFilePath(file.filePath);
						}}
						style={{
							fontSize: '12px',
							padding: '2px 5px',
						}}
					>
						Copy file url to clipboard
					</Button>
				);
			},
		},
		{
			name: 'created_at',
			label: 'Created at',
			render: (file: FileInterface): string => {
				return new Date(file.created_at).toLocaleDateString('fi-FI');
			},
		},
	];

	const {
		data: files,
		refetch,
	}: {
		data: FileInterface[] | undefined;
		refetch: () => void;
	} = useQuery({
		queryKey: ['files'],
		queryFn: () => api.files.getAll(),
	});

	const filterFiles = (file: FileInterface): boolean => {
		return file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
	};

	const handleEdit = (file: FileInterface): void => {
		setIsEditingFile(file);
	};

	useEffect(() => {
		const users = document.getElementById('files');
		setTimeout((): void => {
			users?.classList.remove('fade-in');
			users?.classList.add('fade-over');
		}, 100);
	}, []);

	return (
		<Page>
			<div className="container">
				<div className="d-flex justify-content-between align-items-center w-100">
					<Page.Title>Files</Page.Title>
					<Button className="btn-pink" onClick={(): void => setIsEditingFile(null)}>
						Upload file
					</Button>
				</div>
				<Page.Content className="fade-in" id="files">
					<FileForm editingFile={isEditingFile} setIsEditingFile={setIsEditingFile} refetch={refetch} />
					<SearchBar setSearchTerm={setSearchTerm} />
					<div className="overflow-auto">
						<StyledTable>
							<thead>
								<tr>
									{columns.map((column, index) => {
										return <th key={index}>{column.label}</th>;
									})}
								</tr>
							</thead>
							<tbody>
								{files
									?.filter(file => filterFiles(file))
									.sort((a: FileInterface, b: FileInterface) => {
										return a.created_at > b.created_at ? -1 : 1;
									})
									.map((file: FileInterface) => {
										return (
											<tr
												key={file.fileID}
												style={{
													cursor: 'pointer',
												}}
												onClick={(): void => handleEdit(file)}
											>
												{columns.map((column, index) => {
													return (
														<td key={index}>
															{column.render ? column.render(file) : file[column.name]}
														</td>
													);
												})}
											</tr>
										);
									})}
							</tbody>
						</StyledTable>
					</div>
				</Page.Content>
			</div>
		</Page>
	);
};

export default Files;
