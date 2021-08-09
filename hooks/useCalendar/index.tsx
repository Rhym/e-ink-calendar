import { getDaysInMonth, parseISO, startOfMonth, isSameDay } from "date-fns";
import useSWR from "swr";
import { apiGetGoogleCalendarEvents } from "../../services";

export type Event = {
  id?: string | null;
  title?: string | null;
  date: Date;
  isToday: boolean;
}

export type CalendarDay = {
  date: Date;
  events: Event[];
}

export type UseCalendar = {
  today: number;
  calendarDays: CalendarDay[];
  events: Event[];
  previousMonthDays: number;
  nextMonthDays: number;
  isError: boolean;
  isLoading: boolean;
}

export function useCalendar(): UseCalendar {
  const { data, error } = useSWR('/api/calendar', apiGetGoogleCalendarEvents, {
    revalidateOnFocus: false,
  });

  const DAYS_OF_MONTH_COUNT = getDaysInMonth(new Date());
  const PREV_MONTH_DAYS = startOfMonth(new Date()).getDay();
  const NEXT_MONTH_DAYS = (PREV_MONTH_DAYS + DAYS_OF_MONTH_COUNT) <= 35 ? 35 - (PREV_MONTH_DAYS + DAYS_OF_MONTH_COUNT) : 42 - (PREV_MONTH_DAYS + DAYS_OF_MONTH_COUNT);

  const EVENTS = data?.items?.map(event => ({
    id: event.id,
    title: event.summary,
    date: parseISO(event.start?.dateTime || event.start?.date || ""),
    isToday: isSameDay(parseISO(event.start?.dateTime || event.start?.date || ""), new Date()),
  })) || [];

  /**
   * All days of the month with
   * their assigned events.
   */
  const CALENDAR_DAYS: CalendarDay[] = [...Array(DAYS_OF_MONTH_COUNT)].map((_node, index) => {
    const DAY_DAY = index + 1;
    const DAY_DATE = new Date(new Date().getFullYear(), new Date().getMonth(), DAY_DAY);

    return {
      id: DAY_DAY,
      date: DAY_DATE,
      events: EVENTS.filter((event) => isSameDay(DAY_DATE, event.date))
    }
  });

  return {
    today: new Date().getDate(),
    calendarDays: CALENDAR_DAYS,
    events: EVENTS,
    previousMonthDays: PREV_MONTH_DAYS,
    nextMonthDays: NEXT_MONTH_DAYS,
    isError: error,
    isLoading: !data && !error,
  }
}
