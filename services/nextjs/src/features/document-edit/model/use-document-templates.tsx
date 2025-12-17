import { useCallback } from "react";
import { apiPost } from "@/shared/lib/api-client";

interface UseDocumentTemplatesProps {
  onApply?: (content: any, title?: string) => void;
}

/**
 * 템플릿 생성 및 적용
 */
export const useDocumentTemplates = ({ onApply }: UseDocumentTemplatesProps = {}) => {
  // Create template from document
  const createTemplate = useCallback(async (templateData: any) => {
    try {
      const result = await apiPost('/api/templates', templateData);
      console.log('Template created successfully:', result);
      
      alert(`Template "${templateData.name}" created successfully!`);
      
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }, []);

  // Apply template to document
  const applyTemplate = useCallback((template: any) => {
    if (template.content) {
      const title = template.title || undefined;
      onApply?.(template.content, title);
      alert(`Template "${template.name}" applied successfully!`);
    }
  }, [onApply]);

  return {
    createTemplate,
    applyTemplate,
  };
};

