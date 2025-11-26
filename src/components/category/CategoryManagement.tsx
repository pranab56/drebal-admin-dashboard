// components/category/CategoryManagement.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useState } from 'react';

import CategoryTab from './CategoryTab';
import SubCategoryTab from './SubCategoryTab';
import { Category, SubCategory } from './types/category';

const CategoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('category');

  // Mock data - replace with actual API calls
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: 'Music & Entertainment',
      description: 'All music and entertainment related events',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Sports & Fitness',
      description: 'Sports events and fitness activities',
      image: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop',
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Food & Dining',
      description: 'Food festivals and dining experiences',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      createdAt: new Date()
    }
  ]);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    {
      id: 1,
      name: 'Concert',
      description: 'Live music concerts and performances',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      categoryId: 1,
      categoryName: 'Music & Entertainment',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Professional Sports',
      description: 'Professional sports events and matches',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
      categoryId: 2,
      categoryName: 'Sports & Fitness',
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Food Festival',
      description: 'Food festivals and culinary events',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      categoryId: 3,
      categoryName: 'Food & Dining',
      createdAt: new Date()
    }
  ]);

  const handleAddCategory = (newCategory: Omit<Category, 'id' | 'createdAt'>) => {
    const category: Category = {
      ...newCategory,
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      createdAt: new Date()
    };
    setCategories([...categories, category]);
  };

  const handleEditCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    // Also delete related subcategories
    setSubCategories(subCategories.filter(sub => sub.categoryId !== id));
  };

  const handleAddSubCategory = (newSubCategory: Omit<SubCategory, 'id' | 'createdAt'>) => {
    const subCategory: SubCategory = {
      ...newSubCategory,
      id: Math.max(0, ...subCategories.map(s => s.id)) + 1,
      createdAt: new Date()
    };
    setSubCategories([...subCategories, subCategory]);
  };

  const handleEditSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories(subCategories.map(sub =>
      sub.id === updatedSubCategory.id ? updatedSubCategory : sub
    ));
  };

  const handleDeleteSubCategory = (id: number) => {
    setSubCategories(subCategories.filter(sub => sub.id !== id));
  };

  return (
    <div className=" p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <p className="text-gray-600">Manage your categories and subcategories</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="subcategory">Sub Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <CategoryTab
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>

        <TabsContent value="subcategory">
          <SubCategoryTab
            categories={categories}
            subCategories={subCategories}
            onAddSubCategory={handleAddSubCategory}
            onEditSubCategory={handleEditSubCategory}
            onDeleteSubCategory={handleDeleteSubCategory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryManagement;