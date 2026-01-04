import { Button } from "@/shared/ui/button";
import { Plus, Folder, FileText } from "lucide-react";

interface DocumentsHeaderProps {
  userName?: string;
  documentsCount: number;
  foldersCount: number;
  isCreating: boolean;
  onCreateFolder: () => void;
  onCreateDocument: () => void;
}

export const Header = ({
  userName,
  documentsCount,
  foldersCount,
  isCreating,
  onCreateFolder,
  onCreateDocument,
}: DocumentsHeaderProps) => {
  return (
    <div className="bg-secondary border-b border-gray-200 dark:border-gray-700 sticky h-16 top-0 z-10">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateFolder}
                className="hidden sm:flex border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <Folder className="h-4 w-4 mr-2" />
                New folder
              </Button>

              {/* Mobile folder button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateFolder}
                className="sm:hidden border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <Folder className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onCreateDocument}
                disabled={isCreating}
                className="hidden sm:flex border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? "Creating..." : "New page"}
              </Button>

              {/* Mobile new page button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateDocument}
                disabled={isCreating}
                className="sm:hidden border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

