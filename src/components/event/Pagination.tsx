import { PaginationProps } from './eventType';


export default function Pagination({ currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 p-4 border-t">
      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-100">
        Previous
      </button>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg cursor-pointer ${currentPage === page
            ? 'bg-green-700 text-white cursor-pointer'
            : 'border border-gray-300 hover:bg-gray-50'
            }`}
        >
          {page}
        </button>
      ))}
      <button className="px-3 py-2 border border-gray-300 rounded-lg">...</button>
      <button className="px-3 py-2 border border-gray-300 rounded-lg">25</button>
      <button className="px-4 py-2 bg-green-700 text-white rounded-lg">
        Next
      </button>
    </div>
  );
}