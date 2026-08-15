export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortEditorial: string;
  attributes: string[];
  ingredients: string;
  directions: string;
  compatibility: string;
  discretionNotes: string;
  images: { url: string; alt: string }[];
  relatedSlugs: string[];
}
