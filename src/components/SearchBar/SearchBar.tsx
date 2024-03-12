import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { IoSearchOutline } from 'react-icons/io5';

type PropTypes = {
	setSearchTerm: (searchTerm: string) => void;
};

const SearchBar = (props: PropTypes): JSX.Element => {
	const { setSearchTerm } = props;

	return (
		<InputGroup className="border rounded-pill shadow-sm">
			<InputGroup.Text
				style={{
					backgroundColor: 'white',
					paddingRight: '0',
					paddingLeft: '0',
					border: 'none',
					marginLeft: '10px',
				}}
				id="basic-addon1"
			>
				<IoSearchOutline size={25} />
			</InputGroup.Text>

			<Form.Control
				style={{
					border: 'none',
					fontSize: '16px',
					marginRight: '10px',
				}}
				placeholder="Search"
				onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value)}
			/>
		</InputGroup>
	);
};

export default SearchBar;
