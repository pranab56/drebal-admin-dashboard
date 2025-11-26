// types/category.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  image: string;
  createdAt: Date;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  image: string;
  categoryId: number;
  categoryName: string;
  createdAt: Date;
}

export interface CategoryOption {
  value: string;
  label: string;
}