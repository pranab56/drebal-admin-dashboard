// components/category/CategoryTab.tsx
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
import Image from 'next/image';
import { useState } from 'react';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation
} from '../../features/category/categoryApi';
import AddCategoryModal from './AddCategoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditCategoryModal from './EditCategoryModal';
import { Category } from './types/category';

// Define form data interfaces to match EditCategoryModal
interface CategoryFormData {
  title: string;
  image: File | null;
}

interface CategoryTabProps {
  categories: Category[];
  onRefetch: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  categories,
  onRefetch,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [editCategory, { isLoading: isEditing }] = useEditCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleAddCategory = async (formData: FormData) => {
    try {
      // Extract data from FormData
      const name = formData.get('name') as string;
      const image = formData.get('image') as File | null;

      // Create new FormData for API
      const apiFormData = new FormData();
      apiFormData.append('title', name);

      if (image) {
        apiFormData.append('coverImage', image);
      }

      await createCategory(apiFormData).unwrap();
      onRefetch();
      setIsAddModalOpen(false);
    } catch (error: unknown) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    if (!selectedCategory) return;

    try {
      const formData = new FormData();
      formData.append('title', categoryData.title);

      if (categoryData.image) {
        formData.append('coverImage', categoryData.image);
      }

      await editCategory({
        id: selectedCategory._id,
        data: formData
      }).unwrap();

      onRefetch();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error: unknown) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory({
        id: selectedCategory._id,
        type: 'category'
      }).unwrap();

      onRefetch();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Categories</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
          disabled={isCreating}
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Adding...' : 'Add Category'}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <Image
                    src={category.coverImage}
                    alt={category.title}
                    width={1000}
                    height={1000}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{category.title}</TableCell>
                <TableCell>
                  {category.description || (
                    <span className="text-gray-400">No description</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      disabled={isEditing}
                      type="button"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isDeleting}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found
          </div>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
        isLoading={isCreating}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveCategory}
        category={selectedCategory}
        isLoading={isEditing}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CategoryTab;