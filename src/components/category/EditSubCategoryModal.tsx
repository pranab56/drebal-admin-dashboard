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
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Category, SubCategory } from './types/category';

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subCategory: SubCategory & { imageFile?: File }) => void;
  subCategory: SubCategory | null;
  categories: Category[];
}

const EditSubCategoryModal: React.FC<EditSubCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subCategory,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '', // For preview
    categoryId: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (subCategory) {
      setFormData({
        name: subCategory.name,
        description: subCategory.description || '',
        image: subCategory.image,
        categoryId: subCategory.categoryId.toString()
      });
      setOriginalImage(subCategory.image);
      setImageFile(null);
    }
  }, [subCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategory) return;

    setIsLoading(true);

    try {
      const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoryId));
      if (!selectedCategory) return;

      const updatedSubCategory = {
        ...subCategory,
        name: formData.name,
        description: formData.description,
        image: imageFile ? URL.createObjectURL(imageFile) : formData.image,
        categoryId: parseInt(formData.categoryId),
        categoryName: selectedCategory.name,
        ...(imageFile && { imageFile }) // Only include if new file is uploaded
      };

      await onSave(updatedSubCategory);
      onClose();
    } catch (error) {
      console.error('Error updating sub category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should be less than 5MB');
      return;
    }

    setImageFile(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: previewUrl }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const removeImage = () => {
    if (imageFile) {
      // Remove newly uploaded image, revert to original
      setImageFile(null);
      if (subCategory) {
        setFormData(prev => ({ ...prev, image: originalImage }));
      }
    } else {
      // Remove existing image
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const revertToOriginal = () => {
    if (subCategory) {
      setFormData(prev => ({
        ...prev,
        image: originalImage
      }));
      setImageFile(null);
    }
  };

  const handleClose = () => {
    if (subCategory) {
      setFormData({
        name: subCategory.name,
        description: subCategory.description || '',
        image: subCategory.image,
        categoryId: subCategory.categoryId.toString()
      });
    }
    setImageFile(null);
    setDragActive(false);
    onClose();
  };

  const hasImageChanged = imageFile !== null || formData.image !== originalImage;

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
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
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

          <div className="space-y-2">
            <Label htmlFor="edit-subcategory-description">Description</Label>
            <Textarea
              id="edit-subcategory-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter sub category description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-subcategory-image">Sub Category Image</Label>

            {!formData.image ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                  } ${isUploading ? 'opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('edit-subcategory-file-input')?.click()}
              >
                <input
                  id="edit-subcategory-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => document.getElementById('edit-subcategory-file-input')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="edit-subcategory-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {hasImageChanged && (
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      New Image
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={revertToOriginal}
                    >
                      Revert
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading || !formData.image}
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