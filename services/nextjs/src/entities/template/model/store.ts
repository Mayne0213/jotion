import { create } from 'zustand';
import { DatabaseTemplate, TemplateState, TemplateActions } from './types';

// Template state management store
export const useTemplateStore = create<TemplateState & TemplateActions>((set) => ({
  templates: [],
  currentTemplate: null,
  isLoading: true,

  readTemplates: (templates: DatabaseTemplate[]) => set({ templates }),

  setCurrentTemplate: (template: DatabaseTemplate | null) => set({ currentTemplate: template }),

  createTemplate: (newTemplate: DatabaseTemplate) => set((state) => ({
    templates: [newTemplate, ...state.templates]
  })),

  updateTemplate: (updatedTemplate: DatabaseTemplate) => set((state) => ({
    templates: state.templates.map(template =>
      template.id === updatedTemplate.id ? updatedTemplate : template
    ),
    currentTemplate: state.currentTemplate?.id === updatedTemplate.id 
      ? updatedTemplate 
      : state.currentTemplate
  })),

  deleteTemplate: (templateId: string) => set((state) => ({
    templates: state.templates.filter(template => template.id !== templateId),
    currentTemplate: state.currentTemplate?.id === templateId 
      ? null 
      : state.currentTemplate
  })),

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

