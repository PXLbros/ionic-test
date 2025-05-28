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
  dateOnly: string;
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
export interface VendorProperties {
  name: string;
  description: string;
  id: number;
  type: 'vendor';
  categories?: number[];
}

export interface ServiceProperties {
  title: string;
  description: string;
  id: number;
  is_accessible: boolean;
  type: 'service';
  categories: number[];
}

export interface ServiceMap {
  id: number;
  name: string;
  slug: string;
  type: 'service' | 'vendor';
  num_services?: number;
  num_vendors?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  num_services?: number;
  num_vendors?: number;
  maps?: number[];
  map_slugs: string[];
}

export interface SearchSuggestion {
  id: number;
  name: string;
  description?: string;
  type: 'vendor' | 'service';
  longitude: number;
  latitude: number;
  categories?: number[];
  mapId?: number;
  mapName?: string;
  mapSlug?: string;
}

export interface FairgroundsAsset {
  url: string;
  title: string;
  filename: string;
}

export interface FairgroundsVenue {
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
  venuePreheader: string | null;
  venueMainImage: FairgroundsAsset[];
  venueImageGallery: FairgroundsAsset[];
  venuePricingSheet: FairgroundsAsset[];
  venueSpecSheet: FairgroundsAsset[];
  venueSpecifications: {
    specTitle: string;
    specValue: string;
  }[];
  venueFloorPlanPdf: FairgroundsAsset[];
  venueFloorPlanImage: FairgroundsAsset[];
  venueFloorPlanFeatures: string;
}

export interface FairgroundsEventDate {
  date: string;
  endTime: string;
  startTime: string;
  start_time_date: string;
  start_time_unix: number;
  start_time_time: string;
  end_time_time: string;
  date_time_formatted: string;
  isFavorite: boolean;
  isAddingToFavorites: boolean;
  isRemovingFromFavorites: boolean;
  is_upcoming: boolean;
}

export interface FairgroundsEventImage {
  filename: string;
  title: string;
  url: string;
}

export interface FairgroundsEvent {
  id: string;
  title: string;
  eventBody: string;
  dates: FairgroundsEventDate[];
  eventImage: FairgroundsEventImage[];
  eventAdmission: string;
  uri: string;
  eventWebSite: string;
  enabled: boolean;
  eventContactEmail: string;
  eventContactPhone: string;
  eventVenues: FairgroundsVenue[];
  eventTypes: any[];
}
