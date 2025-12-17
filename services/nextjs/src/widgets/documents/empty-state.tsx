import { Button } from "@/shared/ui/button";
import { Plus, Folder } from "lucide-react";

interface EmptyStateProps {
  variant?: "workspace" | "folder";
  isCreating: boolean;
  onCreateFolder: () => void;
  onCreateDocument: () => void;
}

export const EmptyState = ({
  variant = "workspace",
  isCreating,
  onCreateFolder,
  onCreateDocument,
}: EmptyStateProps) => {
  if (variant === "folder") {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16">
        <div className="text-4xl sm:text-5xl md:text-6xl mx-auto mb-3 sm:mb-4">
          📄
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-1.5 sm:mb-2 px-4">
          No pages in this folder
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-4">
          Create your first page in this folder
        </p>
        <Button
          onClick={onCreateDocument}
          disabled={isCreating}
          className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "Creating..." : "Create page"}
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">📁</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Welcome to your workspace
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
        Create your first folder or page to get started organizing your documents.
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          onClick={onCreateFolder}
          variant="outline"
          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <Folder className="h-4 w-4 mr-2" />
          New folder
        </Button>
        <Button
          onClick={onCreateDocument}
          disabled={isCreating}
          className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "Creating..." : "New page"}
        </Button>
      </div>
    </div>
  );
};

