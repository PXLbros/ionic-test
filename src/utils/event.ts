import { Category, Event, FairgroundsEventDate } from '@/types';
import { convertToEasternTime } from './time';
// import { toZonedTime } from 'date-fns-tz';
// import appConfig from '@/config/app';
// import { isSameDay } from 'date-fns';

export interface FormattedEvent extends Event {
  start_time: string;
  start_time_formatted: string;
  end_time: string;
  eventDate: any;
  currentDate?: FairgroundsEventDate;
  dateDetails: any;
  categoryNames: string[];
}

export const formatEvent = ({ event, eventDate, categories }: { event: any; eventDate: any; categories: Category[] }): FormattedEvent => {
  const eventCategories = categories.filter((category: Category) => {
    return event.categories.find((categoryId: number) => categoryId === category.id);
  });


  // const matchingDates = event.dates.filter((eventDate: FairgroundsEventDate) => {
  //   const parsedDate = parseISO(eventDate.date);
  //   const zonedEventDate = toZonedTime(parsedDate, appConfig.timezone);

  //   return isSameDay(zonedEventDate, zonedDate);
  // });

  // return matchingDates.map((matchedDate: FairgroundsEventDate): EventWithCurrentDate => ({
  //   ...event,
  //   currentDate: matchedDate
  // }));

  // const matchingDates = event.dates.filter((eventDate: FairgroundsEventDate) => {
  //   const parsedDate = new Date(eventDate.start_time_unix * 1000);
  //   const zonedEventDate = toZonedTime(parsedDate, appConfig.timezone);

  //   return isSameDay(zonedEventDate, zonedDate);
  // });

  const formattedEvent = {
    ...event,
    start_time: convertToEasternTime(eventDate.start_time_unix).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    eventDate,
    dateDetails: eventDate,
    categoryNames: eventCategories.map((category: Category) => {
      return category.name;
    }),
  };

  return formattedEvent;
}
