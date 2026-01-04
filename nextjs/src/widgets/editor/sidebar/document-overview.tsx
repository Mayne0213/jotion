import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { HeadingItem } from '@/shared/types';

interface DocumentOverviewProps {
  isExpanded: boolean;
  onToggle: () => void;
  treeHeadings: HeadingItem[];
  activeHeading: string;
  toggleHeadingExpansion: (headingId: string) => void;
  scrollToHeading: (headingId: string) => void;
}

export const DocumentOverview = ({
  isExpanded,
  onToggle,
  treeHeadings,
  activeHeading,
  toggleHeadingExpansion,
  scrollToHeading,
}: DocumentOverviewProps) => {
  const renderTreeHeading = (heading: HeadingItem, depth: number = 0): JSX.Element => {
    const hasChildren = heading.children && heading.children.length > 0;
    const isActive = activeHeading === heading.id;
    
    return (
      <div className="select-none">
        <div className="flex items-center group w-full">
          <div className="flex items-center w-full min-w-0" style={{ paddingLeft: `${depth * 16}px` }}>
            <div className="w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHeadingExpansion(heading.id);
                  }}
                  className="w-4 h-4 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
                >
                  {heading.isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
            
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                "flex-1 text-left text-xs sm:text-sm p-1.5 rounded-md transition-all duration-200 min-w-0 truncate",
                "hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm hover:scale-[1.01]",
                "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50",
                isActive && "bg-gray-100 dark:bg-secondary dark:border dark:border-gray-700 text-gray-900 dark:text-gray-100 font-medium ring-1 ring-gray-300 dark:ring-gray-600 shadow-sm",
                heading.level === 1 && "font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300",
                heading.level === 2 && "font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300",
                heading.level === 3 && "text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300",
                heading.level >= 4 && "text-gray-600 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300"
              )}
              title={heading.text}
            >
              <span className="block truncate">{heading.text}</span>
            </button>
          </div>
        </div>
        
        {hasChildren && heading.isExpanded && (
          <div className="space-y-0">
            {heading.children!.map((child, index) => (
              <div key={`${child.id}-child-${depth + 1}-${index}`}>
                {renderTreeHeading(child, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
          <BookOpen className="h-4 w-4" />
          Document Overview
        </h3>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {treeHeadings.length > 0 ? (
            <div className="space-y-0 border border-gray-400 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#1F1F1F]">
              <div className="relative">
                {treeHeadings.map((heading, index) => (
                  <div key={`${heading.id}-root-${index}`}>
                    {renderTreeHeading(heading)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic px-2 py-4 text-center">No headings found</p>
          )}
        </div>
      )}
    </div>
  );
};

