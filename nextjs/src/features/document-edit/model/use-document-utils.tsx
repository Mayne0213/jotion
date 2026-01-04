import { useCallback } from "react";

/**
 * 문서 관련 유틸리티 함수
 */
export const useDocumentUtils = () => {
  // Calculate word count
  const getWordCount = useCallback((content: any): number => {
    if (!content?.content) return 0;
    
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || '';
      if (node.content) return node.content.map(extractText).join(' ');
      return '';
    };
    
    const text = content.content.map(extractText).join(' ');
    return text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
  }, []);

  // Format date helper
  const formatDate = useCallback((date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  }, []);

  return {
    getWordCount,
    formatDate,
  };
};

