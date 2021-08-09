import { addMonths, endOfMonth, formatRFC3339 } from 'date-fns';
import { calendar_v3 } from 'googleapis';

export async function apiGetGoogleCalendarEvents(): Promise<calendar_v3.Schema$Events> {
    const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const TIME_MIN = encodeURIComponent(formatRFC3339(new Date()));
    const TIME_MAX = encodeURIComponent(formatRFC3339(endOfMonth(addMonths(new Date(), 1))));
    const MAX_RESULTS = 50;
    const URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${TIME_MIN}&timeMax=${TIME_MAX}&singleEvents=true&orderBy=startTime&maxResults=${MAX_RESULTS}`;

    if (CALENDAR_ID && API_KEY) {
        try {
            const response = await fetch(URL, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw response;
            }
        } catch (errResponse) {
            return Promise.reject(errResponse);
        }
    }

    return Promise.reject();
}
