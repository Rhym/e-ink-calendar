import { format, getDate } from "date-fns";
import React from "react";
import { useCalendar } from "../../hooks";

export const Calendar: React.FC = () => {
  const { today, nextMonthDays, previousMonthDays, calendarDays, events, isLoading } = useCalendar();

  // Render
  //-----------------------------------------------------

  if (isLoading) {
    return null;
  }

  /**
   * @param children
   * @returns
   */
  function DayContainer({ children, ...props }: { children?: React.ReactNode }) {
    return <div {...props} className="bg-white p-2 pb-6 text-center flex flex-col items-center justify-between">{children}</div>
  }

  /**
   * @param children
   * @param isActive
   * @returns
   */
  function Day({ children, isActive, isDisabled }: { children?: React.ReactNode; isActive?: boolean; isDisabled?: boolean }) {
    return (
      <p className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-center ${isDisabled ? "" : ""} ${isActive && !isDisabled ? "bg-black text-white" : ""}`}>
        {children}
      </p>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex flex-column flex-col w-8/12">
        <div className="grid grid-cols-7 gap-px flex-shrink-0 bg-black pb-px pr-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((node) => <p key={node} className="text-center bg-white p-2 text-xs font-semibold">{node}</p>)}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr gap-px flex-1 bg-black pr-px">
          {[...Array(previousMonthDays)].map((_node, index) => {
            return (
              <DayContainer key={`previous-month-${index}`}>
                <Day isDisabled>
                  {index + 1}
                </Day>
              </DayContainer>
            )
          })}
          {calendarDays.map(({ date, events }) => {
            const DAY = getDate(date);

            return (
              <DayContainer key={`day-of-month-${DAY}`}>
                <Day isActive={DAY === today}>
                  {DAY}
                </Day>
                <div className="flex space-x-1">
                  {events.map((_node, eventIndex) => <span key={`${DAY}-indicator-${eventIndex}`} className="block w-2 h-2 bg-black rounded-full" />)}
                </div>
              </DayContainer>
            );
          })}
          {[...Array(nextMonthDays)].map((_node, index) => {
            return (
              <DayContainer key={`next-month-${index}`}>
                <Day isDisabled>
                  {index + 1}
                </Day>
              </DayContainer>
            )
          })}
        </div>
      </div>
      <div className="w-4/12">
        <div className="flex flex-col h-full">
          <div className="flex-1 min-w-0">
            <p className="text-center p-2 text-xs font-semibold border-b border-black">{`Upcoming`}</p>
            <ol className=" list space-y-2 p-4">
              {events.map(({ id, title, date, isToday }) => {
                return (
                  <li key={id}>
                    <p className="space-x-4 truncate">
                      <span className={`font-semibold tabular-nums`}>{format(date, "dd/MM")}</span>
                      <span className={isToday ? "text-red-500" : ""}>{title}</span>
                    </p>
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="flex-shrink-0">
            <p className="text-right p-4 text-sm">
              {`Updated: `}
              {format(new Date(), "dd/MM HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
