
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Category } from './category';


interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <div className="relative h-48">
        <Image
          height={1000}
          width={1000}
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-xs">{category.name}</p>
          <p className="text-sm font-medium">{category.subCategory}</p>
        </div>
      </div>
      <div className="p-2 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 text-red-600 hover:bg-red-50"
          onClick={() => onDelete(category)}
        >
          Delete
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => onEdit(category)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default CategoryCard;