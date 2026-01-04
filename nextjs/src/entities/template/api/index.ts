import type { DatabaseTemplate } from '../model/types';
import { apiGet, apiPost, apiPut, apiDelete } from '@/shared/api';

// Template API functions
export const templateApi = {
  // Get all templates
  getTemplates: async (): Promise<DatabaseTemplate[]> => {
    try {
      return await apiGet<DatabaseTemplate[]>('/api/templates');
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw error;
    }
  },

  // Get public templates
  getPublicTemplates: async (): Promise<DatabaseTemplate[]> => {
    try {
      return await apiGet<DatabaseTemplate[]>('/api/templates?public=true');
    } catch (error) {
      console.error('Failed to fetch public templates:', error);
      throw error;
    }
  },

  // Create a new template
  createTemplate: async (newTemplate: Partial<DatabaseTemplate>): Promise<DatabaseTemplate> => {
    try {
      return await apiPost<DatabaseTemplate>('/api/templates', newTemplate);
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  },

  // Update a template
  updateTemplate: async (id: string, updateData: Partial<DatabaseTemplate>): Promise<DatabaseTemplate> => {
    try {
      return await apiPut<DatabaseTemplate>(`/api/templates/${id}`, updateData);
    } catch (error) {
      console.error('Failed to update template:', error);
      throw error;
    }
  },

  // Delete a template
  deleteTemplate: async (id: string): Promise<void> => {
    try {
      await apiDelete<void>(`/api/templates/${id}`);
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw error;
    }
  },
};

