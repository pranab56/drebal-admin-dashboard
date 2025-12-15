// components/category/EditSubCategoryModal.tsx
"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Category, SubCategory } from './types/category';

// Define form data interface
interface SubCategoryFormData {
  name: string;
  categoryId: string;
  description?: string;
  imageFile?: File;
}

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subCategory: SubCategoryFormData) => void;
  subCategory: SubCategory | null;
  categories: Category[];
  isLoading?: boolean;
}

const EditSubCategoryModal: React.FC<EditSubCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subCategory,
  categories,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    categoryId: string;
  }>({
    name: '',
    categoryId: ''
  });

  useEffect(() => {
    if (subCategory) {
      setFormData({
        name: subCategory.title,
        categoryId: subCategory.categoryId
      });
    }
  }, [subCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategory) return;

    const submitData: SubCategoryFormData = {
      name: formData.name,
      categoryId: formData.categoryId,
    };
    await onSave(submitData);
  };

  const handleClose = () => {
    if (subCategory) {
      setFormData({
        name: subCategory.title,
        categoryId: subCategory.categoryId
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Sub Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-subcategory-name">Sub Category Name</Label>
            <Input
              id="edit-subcategory-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter sub category name"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubCategoryModal;