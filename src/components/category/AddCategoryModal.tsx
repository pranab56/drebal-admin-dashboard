import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CategoryOption, NewCategory } from './category';


interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<NewCategory, 'image'> & { image: string }) => void;
  categoryOptions: CategoryOption[];
  subCategoryOptions: CategoryOption[];
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  categoryOptions,
  subCategoryOptions,
}) => {
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: '',
    subCategory: '',
    image: null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory({ ...newCategory, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.subCategory) {
      onAdd({
        name: newCategory.name,
        subCategory: newCategory.subCategory,
        image: newCategory.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      });
      setNewCategory({ name: '', subCategory: '', image: null });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className='w-full'>
            <Label htmlFor="category-name">Category Name</Label>
            <Select

              value={newCategory.name}
              onValueChange={(val) => setNewCategory({ ...newCategory, name: val })}
            >
              <SelectTrigger id="category-name" className="mt-2 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.label}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='w-full'>
            <Label htmlFor="sub-category-name">Sub-Category Name</Label>
            <Select
              value={newCategory.subCategory}
              onValueChange={(val) => setNewCategory({ ...newCategory, subCategory: val })}
            >
              <SelectTrigger id="sub-category-name" className="mt-2 w-full">
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {subCategoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.label}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
              <input
                type="file"
                id="add-file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label htmlFor="add-file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">SVG, PNG, JPG (Max 800*400px)</p>
                </div>
              </label>
              {newCategory.image && (
                <Image src={newCategory.image} alt="Preview" height={100} width={100} className="mt-4 max-h-32 mx-auto rounded" />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleAddCategory}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;