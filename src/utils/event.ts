import { Category, Event } from '@/types';
import { convertToEasternTime } from './time';

export interface FormattedEvent extends Event {
  start_time: string;
  end_time: string;
  eventDate: any;
  dateDetails: any;
  categoryNames: string[];
}

export const formatEvent = ({ event, eventDate, categories }: { event: any; eventDate: any; categories: Category[] }): FormattedEvent => {
  const eventCategories = categories.filter((category: Category) => {
    return event.categories.find((categoryId: number) => categoryId === category.id);
  });

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
