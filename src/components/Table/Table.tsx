import styled from 'styled-components';

export const StyledTable = styled.table`
	table-layout: fixed;
	font-size: 12px;
	border-collapse: collapse;
	border-spacing: 0;
	border: none;
	min-width: 100%;
	tr {
		border-bottom: 1px #dbdbdb solid;
	}
	tbody {
		tr {
			transition: background 0.2s;
			&:hover {
				background-color: #e5e4e2;
			}
		}
	}
	tbody {
		background: #fff;
		td.sticky {
			position: sticky;
			left: 0;
			top: 0;
			z-index: 2;
			background: inherit;
		}
	}
	td,
	th {
		padding: 6px 12px;
		vertical-align: middle;
	}
	th {
		padding-top: 15px;
		padding-bottom: 15px;
		/* text-transform: uppercase;
		font-weight: 500;
		font-size: 12px; */
		background: none;
		a {
			color: #1f1f1f;
			text-decoration: none;
		}
		.list-heading-label-caret {
			display: none;
		}
		&.sort-active {
			.list-heading-label-caret {
				display: inline;
				transition: transform 0.2s;
			}
		}
		a:hover {
			color: #000;
			text-decoration: underline;
		}
		&.not-sortable {
			a {
				pointer-events: none;
			}
		}
		&.sort-active a {
			color: var(--color-purple);
			text-decoration: underline;
		}
		&.sort-active.sort-dir-desc .list-heading-label-caret {
			transform: rotate(-180deg);
		}
	}
	thead {
		border-bottom: 1px solid var(--color-border);
		background: none;
	}
`;
