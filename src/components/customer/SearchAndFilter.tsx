"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Download, Filter, Search } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  setFilterStatus,
}: SearchAndFilterProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2 w-48 bg-white border-gray-200"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-white border-gray-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setFilterStatus('all')}>
            All Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStatus('active')}>
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
            Inactive
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStatus('suspended')}>
            Suspended
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" className="bg-white border-gray-200">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  );
};

export default SearchAndFilter;