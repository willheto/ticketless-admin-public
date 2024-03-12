import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../components/Page/Page';
import api from '@src/api';
import { Card, Row, Col } from 'react-bootstrap';
import { useUser } from '@src/context/UserContext';
import { superAdmins } from '../../../superadmins';

const Overview = (): JSX.Element => {
	useEffect(() => {
		const overview = document.getElementById('overview');
		setTimeout((): void => {
			overview?.classList.remove('fade-in');
			overview?.classList.add('fade-over');
		}, 100);
	}, []);

	const [meta, setMeta] = useState<
		{
			collectionName: string;
			collectionCount: number;
		}[]
	>();

	const { user } = useUser();

	const getSuperAdminMeta = useCallback(async (): Promise<void> => {
		const response = await api.overview.getSuperAdminMeta();
		// @ts-expect-error - TS doesn't know about the meta property
		setMeta(response.meta || []);
	}, []);

	const getMeta = useCallback(async (): Promise<void> => {
		try {
			if (!user) return;
			if (superAdmins.includes(user?.email)) {
				getSuperAdminMeta();
			}
		} catch (error) {
			console.log(error);
		}
	}, [user, getSuperAdminMeta]);

	useEffect(() => {
		getMeta();
	}, [getMeta]);

	const mapSuperAdminMeta = (): {
		collectionName: string;
		collectionCount: number;
	}[] => {
		const metaOrder = [
			'Organizations',
			'Users',
			'Events',
			'Tickets',
			'Chats',
			'Messages',
			'Subscriptions',
			'Advertisements',
		];

		return metaOrder?.map(item => {
			const metaName = item.toLowerCase();
			const found = meta?.[metaName];

			return {
				collectionName: item,
				collectionCount: found?.count || 0,
			};
		});
	};

	return (
		<Page>
			<div className="container">
				<Page.Title>Overview</Page.Title>

				<div className="fade-in mt-4" id="overview">
					<Row xs={1} md={2} lg={3} className="g-4">
						{mapSuperAdminMeta().map(
							(
								item: {
									collectionName: string;
									collectionCount: number;
								},
								index: number,
							) => (
								<Col key={index}>
									<Card className="p-4">
										<h1 className="text-center">{item.collectionCount}</h1>
										<h3 className="text-center">{item.collectionName}</h3>
									</Card>
								</Col>
							),
						)}
					</Row>
					<Row></Row>
				</div>
			</div>
		</Page>
	);
};

export default Overview;
