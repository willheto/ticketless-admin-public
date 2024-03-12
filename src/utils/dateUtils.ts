import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const utcStringToLocalDate = (utcDateString: string): Date => {
	const date = new Date(utcDateString + 'Z');
	return date;
};

export const toUtc = (
	date: string | Date,
	toFormat: string = 'yyyy-MM-dd HH:mm:ss',
): string => {
	if (date instanceof Date) {
		const utcDate = utcToZonedTime(date, 'UTC');
		return format(utcDate, toFormat);
	}

	return format(new Date(date), toFormat);
};

type DateFormats = 'date' | 'time' | 'dateTime' | 'exactTime';

export const formatDate = (
	date: Date,
	toFormat: DateFormats = 'date',
): string => {
	if (date instanceof Date) {
		switch (toFormat) {
			case 'date':
				return format(date, 'dd.MM.yyyy');
			case 'time':
				return format(date, 'HH:mm');
			case 'dateTime':
				return format(date, 'dd.MM.yyyy HH:mm');
			case 'exactTime':
				return format(date, 'dd.MM.yyyy HH:mm:ss');
		}
		return format(date, toFormat);
	}

	return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
};
