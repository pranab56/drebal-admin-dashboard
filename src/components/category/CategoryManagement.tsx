// components/category/CategoryManagement.tsx
"use client";

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { baseURL } from '../../../utils/BaseURL';
import { useCreateCategoryMutation, useDeleteCategoryMutation, useEditCategoryMutation, useGetAllCategoryQuery } from '../../features/category/categoryApi';
import { useCreateSubCategoryMutation, useDeleteSubCategoryMutation, useEditSubCategoryMutation, useGetAllSubCategoryQuery } from '../../features/subCategory/subCategoryApi';
import AddCategoryModal from './AddCategoryModal';
import AddSubCategoryModal from './AddSubCategoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditCategoryModal from './EditCategoryModal';
import EditSubCategoryModal from './EditSubCategoryModal';
import { Category, SubCategory } from './types/category';

const CategoryManagement: React.FC = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Category | SubCategory | null>(null);
  console.log(itemToDelete)
  const [deleteType, setDeleteType] = useState<'category' | 'subcategory'>('category');

  const {
    data: categoriesData,
    isLoading: categoryLoading,
    refetch: refetchCategories
  } = useGetAllCategoryQuery({});

  const {
    data: subCategoriesData,
    isLoading: subCategoryLoading,
    refetch: refetchSubCategories
  } = useGetAllSubCategoryQuery({});

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [createSubCategory, { isLoading: isCreatingSubCategory }] = useCreateSubCategoryMutation();
  const [editCategory, { isLoading: isEditing }] = useEditCategoryMutation();
  const [editSubCategory, { isLoading: isEditingSubCategory }] = useEditSubCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  const [deleteSubCategory, { isLoading: isDeletingSubCategory }] = useDeleteSubCategoryMutation();

  const categories: Category[] = categoriesData?.data || [];
  const subCategories: SubCategory[] = subCategoriesData?.data || [];

  const handleAddCategory = async (categoryData: any) => {
    try {
      const title = {
        title: categoryData.name
      }

      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(title));
      formDataToSend.append('image', categoryData.image as File);
      const response = await createCategory(formDataToSend).unwrap();
      refetchCategories();
      refetchSubCategories();
      setIsAddCategoryModalOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  const handleAddSubCategory = async (subCategoryData: any) => {
    try {
      const response = await createSubCategory(subCategoryData).unwrap();
      refetchSubCategories();
      setIsAddSubCategoryModalOpen(false);
    } catch (error) {
      console.error('Error adding subcategory:', error);
      alert('Error adding subcategory');
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditSubCategoryModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: any) => {
    if (!selectedCategory) return;

    try {
      const formData = new FormData();
      formData.append('title', categoryData.title);
      formData.append('image', categoryData.image as File);
      await editCategory({
        id: selectedCategory._id,
        data: formData
      }).unwrap();

      refetchCategories();
      refetchSubCategories();
      setIsEditCategoryModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  };

  const handleSaveSubCategory = async (subCategoryData: any) => {
    if (!selectedSubCategory) return;

    try {
      const formData = new FormData();
      formData.append('title', subCategoryData.name);
      formData.append('categoryId', subCategoryData.categoryId);
      if (subCategoryData.description) {
        formData.append('description', subCategoryData.description);
      }

      if (subCategoryData.imageFile) {
        formData.append('coverImage', subCategoryData.imageFile);
      }

      await editSubCategory({
        id: selectedSubCategory._id,
        data: formData
      }).unwrap();

      refetchSubCategories();
      setIsEditSubCategoryModalOpen(false);
      setSelectedSubCategory(null);
    } catch (error) {
      console.error('Error updating subcategory:', error);
      alert('Error updating subcategory');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setItemToDelete(category);
    setDeleteType('category');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubCategory = (subCategory: SubCategory) => {


    setItemToDelete(subCategory);
    setDeleteType('subcategory');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'category') {
        await deleteCategory({
          id: (itemToDelete as Category)._id,
          type: 'category'
        }).unwrap();
      } else {
        await deleteSubCategory({
          subcategoryId: itemToDelete._id,
          type: 'subCategory'
        }).unwrap();
      }

      refetchCategories();
      refetchSubCategories();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } catch (error) {
      console.error('Error deleting:', error);
      alert(`Error deleting ${deleteType}`);
    }
  };

  const getSubCategoriesByCategoryId = (categoryId: string) => {
    return subCategories.filter(sub => sub.categoryId === categoryId);
  };

  if (categoryLoading || subCategoryLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <p className="text-gray-600">Manage your categories and subcategories</p>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">All Categories</h2>
          <div className='space-x-4'>
            <Button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>

            <Button
              onClick={() => setIsAddSubCategoryModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isCreatingSubCategory}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sub Category
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SubCategories</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const categorySubCategories = getSubCategoriesByCategoryId(category._id);
                return (
                  <TableRow key={category._id}>
                    <TableCell>
                      <img
                        src={baseURL + category.coverImage}
                        alt={category.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.title}</TableCell>
                    <TableCell>
                      {categorySubCategories.length > 0 ? (
                        <span className="text-green-600 font-medium">
                          {categorySubCategories.length} subcategories
                        </span>
                      ) : (
                        <span className="text-gray-400">No subcategories</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Category Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          disabled={isEditing}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Category
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1"
                          disabled={isDeletingCategory}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No categories found
            </div>
          )}
        </div>
      </div>

      {/* Sub Categories Section - Grouped by Category */}
      {categories?.map((category) => {
        const categorySubCategories = getSubCategoriesByCategoryId(category._id);

        if (categorySubCategories.length === 0) return null;

        return (
          <div key={category._id} className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
                <p className="text-sm text-gray-600">
                  {categorySubCategories.length} subcategories
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border ml-14">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySubCategories.reverse().map((subCategory) => (
                    <TableRow key={subCategory._id}>
                      <TableCell className="font-medium">
                        {subCategory.title}
                      </TableCell>
                      <TableCell>
                        {new Date(subCategory.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit SubCategory Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSubCategory(subCategory)}
                            disabled={isEditingSubCategory}
                            className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          >
                            <Edit className="w-4 h-4" />
                            Edit SubCategory
                          </Button>

                          {/* Delete SubCategory Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSubCategory(subCategory)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            disabled={isDeletingSubCategory}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAdd={handleAddCategory}
        isLoading={isCreating}
      />

      <AddSubCategoryModal
        isOpen={isAddSubCategoryModalOpen}
        onClose={() => setIsAddSubCategoryModalOpen(false)}
        onAdd={handleAddSubCategory}
        categories={categories}
        isLoading={isCreatingSubCategory}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveCategory}
        category={selectedCategory}
        isLoading={isEditing}
      />

      <EditSubCategoryModal
        isOpen={isEditSubCategoryModalOpen}
        onClose={() => {
          setIsEditSubCategoryModalOpen(false);
          setSelectedSubCategory(null);
        }}
        onSave={handleSaveSubCategory}
        subCategory={selectedSubCategory}
        categories={categories}
        isLoading={isEditingSubCategory}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
          setSelectedCategory(null);
          setSelectedSubCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteType === 'category' ? 'Category' : 'Sub Category'}`}
        description={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
        isLoading={deleteType === 'category' ? isDeletingCategory : isDeletingSubCategory}
      />
    </div>
  );
};

export default CategoryManagement;