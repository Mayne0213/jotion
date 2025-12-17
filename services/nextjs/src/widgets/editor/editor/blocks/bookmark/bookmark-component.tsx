import React, { useEffect, useState } from 'react';
import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { ExternalLink, AlertCircle, Loader2, Globe } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { BookmarkAttributes } from '@/shared/types';

export const BookmarkComponent: React.FC<ReactNodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { url, title, description, image, domain, loading, error } = node.attrs as BookmarkAttributes;
  const [isHovered, setIsHovered] = useState(false);

  // Extract domain from URL if not provided
  const displayDomain = domain || (url ? new URL(url).hostname : '');

  const handleClick = () => {
    if (url && !loading && !error) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <NodeViewWrapper className="bookmark-wrapper">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-secondary rounded-lg flex items-center justify-center animate-pulse">
              <Loader2 className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Globe className="h-3 w-3" />
                <span>Loading bookmark...</span>
              </div>
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  if (error) {
    return (
      <NodeViewWrapper className="bookmark-wrapper">
        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-red-800 dark:text-red-300">Failed to load bookmark</div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</div>
              <div className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400 mt-2">
                <Globe className="h-3 w-3" />
                <span>{displayDomain}</span>
              </div>
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="bookmark-wrapper">
      <div
        className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1F1F1F] p-2 transition-all duration-200 ${
          isHovered ? 'shadow-md border-gray-300 dark:border-gray-600' : 'shadow-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex cursor-pointer items-center"
          onClick={handleClick}
        >
          {/* Image */}
          {image && (
            <div className="w-32 h-24 sm:w-40 sm:h-28 flex-shrink-0 ">
              <img
                src={image}
                alt={title || 'Bookmark image'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-3 sm:p-4 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Title */}
                {title ? (
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                    {title}
                  </h3>
                ) : (
                  <h3 className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">
                    {displayDomain}
                  </h3>
                )}

                {/* Description */}
                {description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {description}
                  </p>
                )}

                {/* Domain */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Globe className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{displayDomain}</span>
                </div>
              </div>

              {/* External link icon */}
              <div className="flex-shrink-0">
                <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

