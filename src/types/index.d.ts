export interface Venue {
  name: string;
  description: string;
}

export interface EventDate {
  start_time_date: string;
  start_time_unix: number;
  isFavorite?: boolean;
  isAddingToFavorites?: boolean;
  isRemovingFromFavorites?: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  permalink: string;
  categories: number[];
  start_time: string;
  dates: EventDate[];
  duration: number;
  created_at: string;
  featured_image: string;
  venue: Venue;
  dateDetails: EventDate;
  isFavorite?: boolean;
  isAddingToFavorites?: boolean;
  isRemovingFromFavorites?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface DateObject {
  dayName: string;
  day: number;
  timestamp: number;
}

export interface NewsArticle {
  title: string;
  content: string;
  permalink: string;
  created_at: string;
}
