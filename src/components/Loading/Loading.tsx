import React from 'react';

type propTypes = {
	text?: string;
};

const Loading = (props: propTypes): JSX.Element => {
	const { text } = props;
	return (
		<div className="d-flex justify-content-center h-100 align-items-center">
			<div className="d-flex flex-column align-items-center">
				<div className="mb-2 spinner-border" role="status"></div>
				{text}
			</div>
		</div>
	);
};
export { Loading };
