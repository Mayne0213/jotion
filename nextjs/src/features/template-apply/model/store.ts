import { useCallback } from 'react';
import { templateApi } from '@/entities/template/api';
import { useTemplateStore } from '@/entities/template/model/store';
import type { DatabaseTemplate } from '@/entities/template/model';

// Template apply feature store
export const useTemplateApplyStore = () => {
  const entityStore = useTemplateStore.getState();

  const applyTemplate = useCallback(async (documentId: string, template: DatabaseTemplate) => {
    entityStore.setLoading(true);
    try {
      // Apply template content to document
      await templateApi.updateTemplate(template.id, {
        // Template application logic
      });
      return template;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const createTemplateFromDocument = useCallback(async (documentId: string, templateData: Partial<DatabaseTemplate>) => {
    entityStore.setLoading(true);
    try {
      const template = await templateApi.createTemplate({
        ...templateData,
        content: templateData.content || {},
      });
      entityStore.createTemplate(template);
      return template;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  return {
    applyTemplate,
    createTemplateFromDocument,
  };
};

