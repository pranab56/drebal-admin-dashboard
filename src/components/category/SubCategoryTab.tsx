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

import DeleteConfirmationModal from './DeleteConfirmationModal';

import AddSubCategoryModal from './AddSubCategoryModal';
import EditSubCategoryModal from './EditSubCategoryModal';
import { Category, SubCategory } from './types/category';

interface SubCategoryTabProps {
  categories: Category[];
  subCategories: SubCategory[];
  onAddSubCategory: (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => void;
  onEditSubCategory: (subCategory: SubCategory) => void;
  onDeleteSubCategory: (id: number) => void;
}

const SubCategoryTab: React.FC<SubCategoryTabProps> = ({
  categories,
  subCategories,
  onAddSubCategory,
  onEditSubCategory,
  onDeleteSubCategory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  const handleEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleDelete = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSubCategory) {
      onDeleteSubCategory(selectedSubCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedSubCategory(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Sub Categories</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Sub Category
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
              <TableRow key={subCategory.id}>
                <TableCell>
                  <img
                    src={subCategory.image}
                    alt={subCategory.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{subCategory.name}</TableCell>
                <TableCell>{subCategory.categoryName}</TableCell>
                <TableCell>
                  {subCategory.description || (
                    <span className="text-gray-400">No description</span>
                  )}
                </TableCell>
                <TableCell>
                  {subCategory.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subCategory)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subCategory)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <AddSubCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddSubCategory}
        categories={categories}
      />

      <EditSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubCategory(null);
        }}
        onSave={onEditSubCategory}
        subCategory={selectedSubCategory}
        categories={categories}
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
      />
    </div>
  );
};

export default SubCategoryTab;