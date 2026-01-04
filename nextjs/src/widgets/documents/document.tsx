import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { FileText, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";

interface DocumentProps {
  id: string;
  title: string;
  icon?: string;
  onDelete: (id: string) => void;
}

export const Document = ({
  id,
  title,
  icon,
  onDelete,
}: DocumentProps) => {
  return (
    <div className="group relative">
      <Link
        href={`/documents/${id}`}
        className="bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer flex flex-col items-center justify-center aspect-square"
      >
        {/* Document icon */}
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
          {icon ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <FileText className="h-6 w-6 text-black dark:text-white" />
          )}
        </div>

        {/* Document title */}
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm text-center line-clamp-2">
          {title}
        </h4>
      </Link>

      {/* Delete button - outside Link */}
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.preventDefault()}
          asChild
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-6 w-6 p-0 z-10"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onDelete(id)}
            className="text-red-600"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

