// Template entity types
export interface Template {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactElement | string;
  content: any;
}

export interface DatabaseTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  title: string;
  content: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TemplateBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DatabaseTemplate) => void;
}

export interface TemplateSelectorProps {
  onSelectTemplate: (template: Template | DatabaseTemplate) => void;
}

// Template state
export interface TemplateState {
  templates: DatabaseTemplate[];
  currentTemplate: DatabaseTemplate | null;
  isLoading: boolean;
}

// Template actions
export interface TemplateActions {
  readTemplates: (templates: DatabaseTemplate[]) => void;
  setCurrentTemplate: (template: DatabaseTemplate | null) => void;
  createTemplate: (template: DatabaseTemplate) => void;
  updateTemplate: (updatedTemplate: DatabaseTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

