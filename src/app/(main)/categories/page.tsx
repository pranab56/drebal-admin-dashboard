"use client";


import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useState } from 'react';
import AddCategoryModal from '../../../components/category/AddCategoryModal';
import { Category, CategoryOption } from '../../../components/category/category';
import CategoryCard from '../../../components/category/CategoryCard';
import DeleteConfirmationModal from '../../../components/category/DeleteConfirmationModal';
import EditCategoryModal from '../../../components/category/EditCategoryModal';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(
    Array(18).fill(null).map((_, i) => ({
      id: i + 1,
      name: 'Music & Entertainment',
      subCategory: 'Concert',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    }))
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentEditCategory, setCurrentEditCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const categoryOptions: CategoryOption[] = [
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'music', label: 'Music & Entertainment' },
    { value: 'food', label: 'Food & Dining' },
  ];

  const subCategoryOptions: CategoryOption[] = [
    { value: 'concert', label: 'Concert' },
    { value: 'professional', label: 'Professional Sports' },
    { value: 'festival', label: 'Festival' },
  ];

  const handleAddCategory = (newCategoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...newCategoryData,
      id: categories.length + 1,
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentEditCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedCategory: Category) => {
    setCategories(
      categories.map((cat) =>
        cat.id === updatedCategory.id
          ? {
            ...cat,
            name: updatedCategory.name,
            subCategory: updatedCategory.subCategory,
            image: updatedCategory.newImage || updatedCategory.image,
          }
          : cat
      )
    );
    setIsEditModalOpen(false);
    setCurrentEditCategory(null);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-semibold">All Categories</h1>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Sub-category" />
              </SelectTrigger>
              <SelectContent>
                {subCategoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Categories
            </Button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
        categoryOptions={categoryOptions}
        subCategoryOptions={subCategoryOptions}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentEditCategory(null);
        }}
        onSave={handleSaveEdit}
        category={currentEditCategory}
        categoryOptions={categoryOptions}
        subCategoryOptions={subCategoryOptions}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CategoryManagement;