import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';

const StyledPage = styled.div`
	position: relative;
	margin: 0 auto;
	max-width: 1200px;

	.page__title {
		font-size: 20px;
		margin-bottom: 0;
	}
`;

export default function Page({ children }: { children: React.ReactNode }): JSX.Element {
	return <StyledPage className={`mt-3 page d-flex flex-column flex-fill overflow-auto w-100`}>{children}</StyledPage>;
}

Page.Title = PageTitle;
Page.Content = PageContent;

function PageContent({
	children = null,
	className,
	id,
}: {
	children: React.ReactNode;
	className?: string;
	id?: string;
}): JSX.Element {
	return (
		<div
			id={id}
			className={`${className && className} page__content mt-2 flex-fill position-relative w-100`}
			style={{
				backgroundColor: 'white',
				padding: '1.5rem',
				boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 3px',
			}}
		>
			{children}
			<Outlet />
		</div>
	);
}

function PageTitle({ children = null, className }: { children: React.ReactNode; className?: string }): JSX.Element {
	return <h1 className={`page__title flex-fill ${className && className}`}>{children}</h1>;
}
