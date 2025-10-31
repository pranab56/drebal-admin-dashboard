"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages?: number;
}

const Pagination = ({ currentPage, setCurrentPage, totalPages = 3 }: PaginationProps) => (
  <div className="flex items-center justify-center gap-2 mt-4">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <Button
        key={page}
        variant={currentPage === page ? "default" : "ghost"}
        size="icon"
        onClick={() => setCurrentPage(page)}
        className={currentPage === page ? "bg-purple-700 hover:bg-purple-800" : ""}
      >
        {page}
      </Button>
    ))}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export default Pagination;