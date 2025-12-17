// Template related types
export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement | string;
  content: any;
}

export interface DatabaseTemplate {
  id: string;
  name: string;
  description: string;
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

