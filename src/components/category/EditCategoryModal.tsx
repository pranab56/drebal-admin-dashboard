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
import { Category, CategoryOption } from './category';


interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category: Category | null;
  categoryOptions: CategoryOption[];
  subCategoryOptions: CategoryOption[];
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  categoryOptions,
  subCategoryOptions,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && category) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave({
          ...category,
          newImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (category) {
      onSave(category);
      onClose();
    }
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className='w-full'>
            <Label htmlFor="edit-category-name">Category Name</Label>
            <Select
              value={category.name}
              onValueChange={(val) => onSave({ ...category, name: val })}
            >
              <SelectTrigger id="edit-category-name" className="mt-2 w-full">
                <SelectValue />
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
            <Label htmlFor="edit-sub-category-name">Sub-Category Name</Label>
            <Select
              value={category.subCategory}
              onValueChange={(val) => onSave({ ...category, subCategory: val })}
            >
              <SelectTrigger id="edit-sub-category-name" className="mt-2 w-full">
                <SelectValue />
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
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Image</p>
                <Image
                  width={100}
                  height={100}
                  src={category.image}
                  alt="Current"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Upload New Image</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
                  <input
                    type="file"
                    id="edit-file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="edit-file-upload" className="cursor-pointer text-center">
                    {category.newImage ? (
                      <Image
                        width={100}
                        height={100}
                        src={category.newImage}
                        alt="New"
                        className="max-h-28 mx-auto"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-xs text-gray-500">Click to upload</p>
                        <p className="text-xs text-gray-400">Max 800*400px</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
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
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;