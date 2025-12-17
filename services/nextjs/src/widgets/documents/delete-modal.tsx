import { Button } from "@/shared/ui/button";
import { Trash } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  folderName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({
  isOpen,
  folderName,
  onConfirm,
  onCancel,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Trash className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete folder
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong>"{folderName}"</strong>?
            This will permanently delete the folder and all its contents including:
          </p>
          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>All documents in this folder</li>
            <li>All subfolders and their contents</li>
            <li>All nested folders and documents</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800"
          >
            Delete folder
          </Button>
        </div>
      </div>
    </div>
  );
};

