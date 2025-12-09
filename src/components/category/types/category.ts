// types/category.ts
export interface Category {
  _id: string;
  userId: string;
  title: string;
  coverImage: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  categoryTitle: string;
  title: string;
  coverImage: string;
  description?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}