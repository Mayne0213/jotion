import { useState } from 'react';

export interface SearchResult {
  type: string;
  text: string;
  id?: string;
  path?: string;
}

export const useSidebarSearch = (content: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search function to extract text from content
  const extractTextFromNode = (node: any, path: string = ''): SearchResult[] => {
    if (!node) return [];

    let results: SearchResult[] = [];

    // Extract text from various node types
    if (node.content) {
      const text = node.content.map((c: any) => c.text || '').join('');
      if (text.trim()) {
        let id;
        if (node.type === 'heading' && node.attrs?.level) {
          // Keep alphanumeric characters (including Korean), spaces become hyphens
          const headingText = text.toLowerCase()
            .replace(/\s+/g, '-')  // Replace spaces with hyphens
            .replace(/[^a-z0-9\u3131-\u3163\uac00-\ud7a3-]+/g, '')  // Keep only letters, numbers, Korean chars, and hyphens
            .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
          id = headingText;
        }
        results.push({
          text,
          type: node.type,
          id,
          path
        });
      }
    }

    // Recursively process children
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any, index: number) => {
        const childPath = path ? `${path}.${node.type}[${index}]` : `${node.type}[${index}]`;
        results.push(...extractTextFromNode(child, childPath));
      });
    }

    return results;
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (!content?.content) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const extractedTexts = extractTextFromNode(content);
    
    // Count occurrences for unique IDs (same as document-overview)
    const idCounts = new Map<string, number>();
    const matches = extractedTexts
      .filter(item => item.text.toLowerCase().includes(query))
      .map(item => {
        // Ensure unique IDs for search results
        if (item.id) {
          const count = idCounts.get(item.id) || 0;
          idCounts.set(item.id, count + 1);
          const uniqueId = count === 0 ? item.id : `${item.id}-${count}`;
          return {
            ...item,
            id: uniqueId
          };
        }
        return item;
      });

    setSearchResults(matches);
    setShowSearchResults(true);
  };

  // Handle keyboard events
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Navigate to search result (using same algorithm as Document Overview)
  const handleNavigateToResult = (result: SearchResult) => {
    // Try to find using data-heading-id attribute first (for headings)
    if (result.id) {
      const element = document.querySelector(`[data-heading-id="${result.id}"]`);
      if (element) {
        scrollAndHighlight(element as HTMLElement);
        return;
      }
      
      // Also check data-node-view-wrapper which wraps the actual heading
      const proseMirror = document.querySelector('.ProseMirror');
      if (proseMirror) {
        const allHeadings = proseMirror.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of Array.from(allHeadings)) {
          const wrapper = heading.closest('[data-node-view-wrapper]');
          if (wrapper) {
            const wrapperId = wrapper.getAttribute('data-heading-id');
            if (wrapperId === result.id) {
              scrollAndHighlight(wrapper as HTMLElement);
              return;
            }
          }
          
          // Also check text-based matching with same ID logic
          const headingText = heading.textContent?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\u3131-\u3163\uac00-\ud7a3-]+/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || '';
          if (headingText === result.id) {
            scrollAndHighlight(heading as HTMLElement);
            return;
          }
        }
      }
    }

    // Try to find in ProseMirror editor content by text
    const proseMirror = document.querySelector('.ProseMirror');
    
    if (proseMirror) {
      const allElements = proseMirror.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote');
      
      // Try to find by text content match
      for (const el of Array.from(allElements)) {
        const elementText = el.textContent || '';
        if (elementText.trim() === result.text.trim()) {
          scrollAndHighlight(el as HTMLElement);
          return;
        }
      }
    }
  };

  const scrollAndHighlight = (element: HTMLElement) => {
    // Simple and reliable scroll (same as Document Overview)
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Add highlight effect
    element.classList.add('bg-yellow-200', 'dark:bg-yellow-900', 'ring-2', 'ring-yellow-400', 'transition-all', 'duration-300', 'rounded');
    
    setTimeout(() => {
      element.classList.remove('bg-yellow-200', 'dark:bg-yellow-900', 'ring-2', 'ring-yellow-400');
    }, 3000);
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-900 font-semibold">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    showSearchResults,
    setShowSearchResults,
    handleSearch,
    handleSearchKeyDown,
    handleClearSearch,
    handleNavigateToResult,
    highlightMatch,
  };
};

