/**
 * Wiki Location Types
 * Represents structured data for Hellfrost Gazetteer wiki locations
 */

export interface WikiLocation {
  id: string;
  name: string;
  type: string;
  cell_id: string;
  population: string;
  ruler: string;
  markdown_content: string;
  nearby_locations: string[];
  npcs: string[];
  factions: string[];
  search_terms: string[];
}

export interface WikiSearchResult {
  item: WikiLocation;
  score?: number;
}
