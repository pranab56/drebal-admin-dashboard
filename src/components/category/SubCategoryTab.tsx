// components/category/SubCategoryTab.tsx
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
import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useEditSubCategoryMutation
} from '../../features/subCategory/subCategoryApi';
import AddSubCategoryModal from './AddSubCategoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditSubCategoryModal from './EditSubCategoryModal';
import { Category, SubCategory } from './types/category';

interface SubCategoryTabProps {
  categories: Category[];
  subCategories: SubCategory[];
  onRefetch: () => void;
}

const SubCategoryTab: React.FC<SubCategoryTabProps> = ({
  categories,
  subCategories,
  onRefetch,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [editSubCategory, { isLoading: isEditing }] = useEditSubCategoryMutation();
  const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoryMutation();

  const handleAddSubCategory = async (subCategoryData: any) => {
    try {
      const formData = new FormData();
      formData.append('title', subCategoryData.name);
      if (subCategoryData.description) {
        formData.append('description', subCategoryData.description);
      }
      formData.append('categoryId', subCategoryData.categoryId);

      if (subCategoryData.imageFile) {
        formData.append('coverImage', subCategoryData.imageFile);
      }

      await createSubCategory(formData).unwrap();
      onRefetch();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding sub category:', error);
      alert('Error adding sub category');
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleSaveSubCategory = async (subCategoryData: any) => {
    if (!selectedSubCategory) return;

    try {
      const formData = new FormData();
      formData.append('title', subCategoryData.name);
      if (subCategoryData.description) {
        formData.append('description', subCategoryData.description);
      }
      formData.append('categoryId', subCategoryData.categoryId);

      if (subCategoryData.imageFile) {
        formData.append('coverImage', subCategoryData.imageFile);
      }

      await editSubCategory({
        id: selectedSubCategory._id,
        data: formData
      }).unwrap();

      onRefetch();
      setIsEditModalOpen(false);
      setSelectedSubCategory(null);
    } catch (error) {
      console.error('Error updating sub category:', error);
      alert('Error updating sub category');
    }
  };

  const handleDelete = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubCategory) return;

    try {
      await deleteSubCategory({
        subcategoryId: selectedSubCategory._id,
        type: 'subcategory'
      }).unwrap();

      onRefetch();
      setIsDeleteModalOpen(false);
      setSelectedSubCategory(null);
    } catch (error) {
      console.error('Error deleting sub category:', error);
      alert('Error deleting sub category');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Sub Categories</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Adding...' : 'Add Sub Category'}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.map((subCategory) => (
              <TableRow key={subCategory._id}>
                <TableCell>
                  <img
                    src={subCategory.coverImage}
                    alt={subCategory.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{subCategory.title}</TableCell>
                <TableCell>{subCategory.categoryTitle}</TableCell>
                <TableCell>
                  {subCategory.description || (
                    <span className="text-gray-400">No description</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(subCategory.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subCategory)}
                      disabled={isEditing}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subCategory)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {subCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sub categories found
          </div>
        )}
      </div>

      <AddSubCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubCategory}
        categories={categories}
        isLoading={isCreating}
      />

      <EditSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubCategory(null);
        }}
        onSave={handleSaveSubCategory}
        subCategory={selectedSubCategory}
        categories={categories}
        isLoading={isEditing}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSubCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Sub Category"
        description="Are you sure you want to delete this sub category? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SubCategoryTab;