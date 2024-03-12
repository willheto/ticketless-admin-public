import { useState, useEffect } from 'react';

function useWindowSize(): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 576);

	useEffect(() => {
		const handleResize = (): void => {
			setIsMobile(window.innerWidth < 576);
		};

		window.addEventListener('resize', handleResize);

		return (): void => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return isMobile;
}

export default useWindowSize;
