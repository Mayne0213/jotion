import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleSearchKeyDown,
  handleClearSearch,
}: SearchBarProps) => {
  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search in document..."
          className="w-full px-3 py-2 pr-20 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-[#1F1F1F] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

