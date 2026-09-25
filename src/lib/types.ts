export type BienType = "appartement" | "villa" | "local" | "programme";
export type BienStatut = "disponible" | "reserve" | "vendu" | "location";

export interface Bien {
  id: string;
  slug: string;
  titre: string;
  type: BienType;
  statut: BienStatut;
  prix: number;
  prixSuffixe?: string;
  surface: number;
  pieces: number;
  chambres: number;
  localisation: string;
  arrondissement?: string;
  description: string;
  images: string[];
  plan2d?: string;
  plans?: string[];
  mapsUrl?: string;
  url3d?: string;
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  dateAjout: string;
  vedette?: boolean;
}

export type LeadEtape = "nouveau" | "contacte" | "visite" | "negociation" | "signe" | "perdu";

export interface Lead {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  bienId?: string;
  etape: LeadEtape;
  date: string;
}

export interface Client {
  id: string;
  nom: string;
  email: string;
  passHash: string;
  favoris: string[];
  date: string;
}

export interface HeroVideo {
  ville: string;
  mp4: string;
  poster: string;
  youtube?: string;
}

export interface SiteSettings {
  adresse: string;
  tel: string;
  telHref: string;
  email: string;
  horaires: string;
  visites: string;
  messageRepondeur: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  logoUrl?: string;
  heroVideos?: HeroVideo[];
  quartierImages?: Record<string, string>;
}
