export type Site = 'nysfair' | 'nysfairgrounds';

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
  id: number;
  title: string;
  content: string;
  permalink: string;
  created_at: string;
  image?: string; // Add the image property
}


// Map Types

// Interfaces for our data
interface VendorProperties {
  name: string;
  description: string;
  id: number;
  type: 'vendor';
  categories?: number[];
}

interface ServiceProperties {
  title: string;
  description: string;
  id: number;
  is_accessible: boolean;
  type: 'service';
  categories: number[];
}

interface ServiceMap {
  id: number;
  name: string;
  slug: string;
  num_services?: number;
  num_vendors?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  num_services?: number;
  num_vendors?: number;
  maps?: number[];
}

interface SearchSuggestion {
  id: number;
  name: string;
  description?: string;
  type: 'vendor' | 'service';
  longitude: number;
  latitude: number;
  categories?: number[];
  mapId?: number;
  mapName?: string;
}

interface FairgroundsVenue {
  id: string;
  title: string;
  slug: string;
  url: string;
  dateCreated: string;
  dateUpdated: string;
  venueDetailBody: string | null;
  venueDetailHeadline: string | null;
  venueDetailPreheader: string | null;
  venueNavTitle: string | null;
  venueSubheader: string | null;
  venueMainImage: string | null;
  venuePreheader: string | null;
}
