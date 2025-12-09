// components/category/EditCategoryModal.tsx
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
import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { baseURL } from '../../../utils/BaseURL';
import { Category } from './types/category';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: any) => void;
  category: Category | null;
  isLoading?: boolean;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.title,
        image: category.coverImage || ''
      });
      setImageFile(null);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    // Expected console.log output
    const data = { title: formData.name, image: imageFile }

    // const submitData = {
    //   title: formData.name,
    //   imageFile: imageFile
    // };

    await onSave(data);
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: previewUrl }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    if (imageFile) {
      // If there's a new file, revert to original image
      setImageFile(null);
      if (category) {
        setFormData(prev => ({ ...prev, image: category.coverImage || '' }));
      }
    } else {
      // If removing original image
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const handleClose = () => {
    if (category) {
      setFormData({
        name: category.title,
        image: category.coverImage || ''
      });
    }
    setImageFile(null);
    onClose();
  };

  const hasImageChanged = imageFile !== null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Category Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">Category Image</Label>

            {!formData.image ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${'border-gray-300 hover:border-gray-400'
                  } ${isUploading ? 'opacity-50' : ''}`}
                onClick={() => document.getElementById('edit-file-input')?.click()}
              >
                <input
                  id="edit-file-input"
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
                  src={formData.image.startsWith('blob:') ? formData.image : baseURL + formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => document.getElementById('edit-file-input')?.click()}
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
                  id="edit-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {hasImageChanged && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      New Image
                    </span>
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

export default EditCategoryModal;