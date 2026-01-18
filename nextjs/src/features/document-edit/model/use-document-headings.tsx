import { useState, useEffect } from 'react';
import type { HeadingItem } from '@/entities/document';

export const useDocumentHeadings = (content: any) => {
  const [headingInstances] = useState<Map<string, HTMLElement[]>>(new Map());
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [treeHeadings, setTreeHeadings] = useState<HeadingItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Convert flat headings to tree structure
  const buildHeadingTree = (flatHeadings: HeadingItem[]): HeadingItem[] => {
    if (flatHeadings.length === 0) return [];
    
    const tree: HeadingItem[] = [];
    const stack: HeadingItem[] = [];
    
    flatHeadings.forEach(heading => {
      const newHeading = { ...heading, children: [], isExpanded: true };
      
      // Find the correct parent by looking at the stack
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }
      
      if (stack.length === 0) {
        // This is a root level heading
        tree.push(newHeading);
      } else {
        // This is a child of the last heading in stack
        const parent = stack[stack.length - 1];
        if (!parent.children) parent.children = [];
        parent.children.push(newHeading);
      }
      
      stack.push(newHeading);
    });
    
    return tree;
  };

  // Extract headings from content
  useEffect(() => {
    if (!content?.content) return;

    const extractHeadings = (node: any, level = 0): HeadingItem[] => {
      if (!node) return [];

      let result: HeadingItem[] = [];
      
      if (node.type === 'heading' && node.attrs?.level) {
        const text = node.content?.map((c: any) => c.text || '').join('') || '';
        // Keep alphanumeric characters (including Korean), spaces become hyphens
        const id = text.toLowerCase()
          .replace(/\s+/g, '-')  // Replace spaces with hyphens
          .replace(/[^a-z0-9\u3131-\u3163\uac00-\ud7a3-]+/g, '')  // Keep only letters, numbers, Korean chars, and hyphens
          .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
        result.push({
          id,
          text,
          level: node.attrs.level
        });
      }

      if (node.content) {
        node.content.forEach((child: any) => {
          result.push(...extractHeadings(child, level));
        });
      }

      return result;
    };

    const extractedHeadings = extractHeadings(content);
    
    // Ensure unique IDs by adding a counter suffix if duplicates exist
    const idCounts = new Map<string, number>();
    const uniqueHeadings = extractedHeadings.map((heading, index) => {
      const baseId = heading.id || 'heading';
      
      // Count how many times we've seen this base ID
      const count = idCounts.get(baseId) || 0;
      idCounts.set(baseId, count + 1);
      
      // If this is the first occurrence, use the base ID
      // Otherwise, append a suffix
      const uniqueId = count === 0 ? baseId : `${baseId}-${count}`;
      
      return {
        ...heading,
        id: uniqueId,
        _index: index // Add sequential index for reference
      };
    });
    
    setHeadings(uniqueHeadings);
    setTreeHeadings(buildHeadingTree(uniqueHeadings));
  }, [content]);

  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => {
        const element = document.querySelector(`[data-heading-id="${h.id}"]`);
        return { ...h, element: element as HTMLElement };
      }).filter(h => h.element);

      let currentHeading = "";
      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        if (heading.element && heading.element.offsetTop <= scrollPosition) {
          currentHeading = heading.id;
          break;
        }
      }

      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const toggleHeadingExpansion = (headingId: string) => {
    const updateHeadingExpansion = (headings: HeadingItem[]): HeadingItem[] => {
      return headings.map(heading => {
        if (heading.id === headingId) {
          return { ...heading, isExpanded: !heading.isExpanded };
        }
        if (heading.children) {
          return { ...heading, children: updateHeadingExpansion(heading.children) };
        }
        return heading;
      });
    };
    
    setTreeHeadings(updateHeadingExpansion(treeHeadings));
  };

  const scrollToHeading = (headingId: string) => {
    const selector1 = `[data-heading-id="${headingId}"]`;
    const allMatches = document.querySelectorAll(selector1);
    
    // Find the position of this heading in the tree structure
    let targetIndex = 0;
    
    const findHeadingInTree = (items: HeadingItem[], targetId: string, path: number[] = []): number[] | null => {
      for (let i = 0; i < items.length; i++) {
        const currentPath = [...path, i];
        if (items[i].id === targetId) {
          return currentPath;
        }
        if (items[i].children) {
          const result = findHeadingInTree(items[i].children!, targetId, currentPath);
          if (result) return result;
        }
      }
      return null;
    };
    
    const targetPath = findHeadingInTree(treeHeadings, headingId);
    
    if (targetPath && targetPath.length > 0) {
      // Count how many headings with the same ID appear before this position
      let count = 0;
      
      const countBefore = (items: HeadingItem[], targetId: string, targetPath: number[], currentPath: number[] = []): number => {
        let count = 0;
        for (let i = 0; i < items.length; i++) {
          const path = [...currentPath, i];
          
          // Check if this is before the target path
          if (items[i].id === targetId) {
            let isBefore = true;
            for (let j = 0; j < Math.min(path.length, targetPath.length); j++) {
              if (path[j] > targetPath[j]) {
                isBefore = false;
                break;
              } else if (path[j] < targetPath[j]) {
                break;
              }
            }
            if (isBefore && JSON.stringify(path) !== JSON.stringify(targetPath)) {
              count++;
            }
          }
          
          if (items[i].children) {
            count += countBefore(items[i].children!, targetId, targetPath, path);
          }
        }
        return count;
      };
      
      targetIndex = countBefore(treeHeadings, headingId, targetPath);
    }
    
    // Get the element at the calculated index
    if (allMatches.length > 0 && targetIndex < allMatches.length) {
      const element = allMatches[targetIndex] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (allMatches.length > 0) {
      // Fallback to first match
      const element = allMatches[0] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    headings,
    treeHeadings,
    activeHeading,
    toggleHeadingExpansion,
    scrollToHeading,
  };
};

