import { BarChart3, ChevronDown, ChevronRight } from "lucide-react";

interface DocumentStatisticsProps {
  isExpanded: boolean;
  onToggle: () => void;
  wordCount: number;
  headingsCount: number;
}

export const DocumentStatistics = ({
  isExpanded,
  onToggle,
  wordCount,
  headingsCount,
}: DocumentStatisticsProps) => {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
          <BarChart3 className="h-4 w-4" />
          Statistics
        </h3>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-gray-50 dark:bg-[#1F1F1F] dark:border dark:border-gray-700 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{wordCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Words</div>
            </div>
            <div className="bg-gray-50 dark:bg-[#1F1F1F] dark:border dark:border-gray-700 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{headingsCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Headings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

