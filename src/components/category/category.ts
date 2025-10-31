export interface Category {
  id: number;
  name: string;
  subCategory: string;
  image: string;
  newImage?: string; // For edit operations
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface NewCategory {
  name: string;
  subCategory: string;
  image: string | null;
}