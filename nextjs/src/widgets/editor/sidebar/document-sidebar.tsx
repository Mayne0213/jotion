"use client";

import { useState } from "react";
import { TemplateModal } from "../template/template-modal";
import { useSidebarSearch, useDocumentHeadings } from "@/features/document-edit";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";
import { DocumentOverview } from "./document-overview";
import { DocumentStatistics } from "./document-statistics";
import { QuickActions } from "./quick-actions";
import type { DocumentSidebarProps } from '@/shared/types';

export const DocumentSidebar = ({
  content,
  title,
  lastSaved,
  wordCount,
  documentId,
  published = false,
  onShare,
  onUnshare,
  onCreateTemplate,
  onApplyTemplate
}: DocumentSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'stats', 'actions']));
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Use custom hooks
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    showSearchResults, 
    setShowSearchResults,
    handleSearch,
    handleSearchKeyDown,
    handleClearSearch,
    handleNavigateToResult,
    highlightMatch 
  } = useSidebarSearch(content);

  const {
    headings,
    treeHeadings,
    activeHeading,
    toggleHeadingExpansion,
    scrollToHeading
  } = useDocumentHeadings(content);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full lg:w-80 bg-secondary border border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Search */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleSearchKeyDown={handleSearchKeyDown}
          handleClearSearch={handleClearSearch}
        />

        {/* Search Results */}
        <SearchResults
          showSearchResults={showSearchResults}
          searchQuery={searchQuery}
          searchResults={searchResults}
          setShowSearchResults={setShowSearchResults}
          handleNavigateToResult={handleNavigateToResult}
          highlightMatch={highlightMatch}
        />

        {/* Document Overview */}
        <DocumentOverview
          isExpanded={expandedSections.has('overview')}
          onToggle={() => toggleSection('overview')}
          treeHeadings={treeHeadings}
          activeHeading={activeHeading}
          toggleHeadingExpansion={toggleHeadingExpansion}
          scrollToHeading={scrollToHeading}
        />

        {/* Document Statistics */}
        <DocumentStatistics
          isExpanded={expandedSections.has('stats')}
          onToggle={() => toggleSection('stats')}
          wordCount={wordCount}
          headingsCount={headings.length}
        />

        {/* Quick Actions */}
        <QuickActions
          isExpanded={expandedSections.has('actions')}
          onToggle={() => toggleSection('actions')}
          published={published}
          onShare={onShare}
          onUnshare={onUnshare}
          onCreateTemplate={() => setShowTemplateModal(true)}
          onApplyTemplate={onApplyTemplate}
        />
      </div>

      {/* Template Modal */}
      {onCreateTemplate && (
        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onCreateTemplate={onCreateTemplate}
          currentTitle={title}
          currentContent={content}
        />
      )}
    </div>
  );
};

