import { ArrowRight } from "lucide-react";
import type { SearchResult } from "@/features/document-edit";

interface SearchResultsProps {
  showSearchResults: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  setShowSearchResults: (show: boolean) => void;
  handleNavigateToResult: (result: SearchResult) => void;
  highlightMatch: (text: string, query: string) => string | JSX.Element[];
}

export const SearchResults = ({
  showSearchResults,
  searchQuery,
  searchResults,
  setShowSearchResults,
  handleNavigateToResult,
  highlightMatch,
}: SearchResultsProps) => {
  if (!showSearchResults) return null;

  if (searchResults.length > 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1F1F1F] p-3 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Search results ({searchResults.length})
          </h3>
          <button
            onClick={() => setShowSearchResults(false)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
        <div className="space-y-2">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleNavigateToResult(result)}
              className="w-full text-left p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                    {result.type === 'heading' ? 'Heading' : result.type === 'paragraph' ? 'Paragraph' : result.type}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 break-words">
                    <>{highlightMatch(result.text, searchQuery)}</>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1F1F1F] p-4 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
        No search results for "<span className="font-medium">{searchQuery}</span>".
      </p>
    </div>
  );
};

