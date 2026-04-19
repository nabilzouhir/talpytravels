export type DestinationStatus = "wishlist" | "planned" | "visited";

export type Payer = "pesciolino" | "talpina";

export type ActivityCategory =
  | "food"
  | "sightseeing"
  | "hiking"
  | "adventure"
  | "accommodation"
  | "chill"
  | "transport"
  | "other";

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string | null;
  cover_image_url: string | null;
  status: DestinationStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  activity_count?: number;
  budget: number | null;
}

export interface Activity {
  id: string;
  destination_id: string;
  title: string;
  category: ActivityCategory;
  notes: string | null;
  done: boolean;
  day_number: number | null;
  price: number | null;
  paid_by: Payer | null;
  latitude: number | null;
  longitude: number | null;
  place_name: string | null;
  created_at: string;
}

export interface DiaryEntry {
  id: string;
  destination_id: string;
  title: string;
  body: string;
  entry_date: string;
  created_at: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  destination_id: string;
  diary_entry_id: string | null;
  storage_path: string;
  caption: string | null;
  taken_at: string | null;
  created_at: string;
}
