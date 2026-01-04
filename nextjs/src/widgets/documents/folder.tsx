import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Folder as FolderIcon, MoreHorizontal, Trash } from "lucide-react";

interface FolderProps {
  id: string;
  name: string;
  icon?: string;
  documentsCount?: number;
  subfoldersCount?: number;
  onClick: () => void;
  onDelete: (id: string, name: string) => void;
  variant?: "desktop" | "mobile";
}

export const Folder = ({
  id,
  name,
  icon,
  documentsCount = 0,
  subfoldersCount = 0,
  onClick,
  onDelete,
  variant = "desktop",
}: FolderProps) => {
  if (variant === "mobile") {
    return (
      <div className="group relative bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={onClick}
          >
             <FolderIcon className="h-5 w-5 text-black dark:text-white" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              asChild
            >
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id, name);
                }}
                className="text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className="cursor-pointer"
          onClick={onClick}
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{name}</h4>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{documentsCount} pages</span>
            <span>{subfoldersCount} folders</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all flex flex-col items-center justify-center aspect-square cursor-pointer"
      onClick={onClick}
    >
      {/* Delete button */}
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          asChild
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id, name);
            }}
            className="text-red-600"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Folder icon */}
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
        <FolderIcon className="h-6 w-6 text-black dark:text-white" />
      </div>

      {/* Folder name */}
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm text-center line-clamp-2">
        {name}
      </h4>
    </div>
  );
};

