import { FolderWithRelations } from '../model/types';
import { cn } from '@/shared/lib/utils';
import { Folder, Calendar } from 'lucide-react';
import Link from 'next/link';

interface FolderItemProps {
  folder: FolderWithRelations;
  className?: string;
}

export const FolderItem = ({ folder, className }: FolderItemProps) => {
  const Icon = folder.icon ? 
    <span className="text-2xl">{folder.icon}</span> : 
    <Folder className="w-6 h-6 text-gray-400" />;

  return (
    <Link 
      href={`/documents?folder=${folder.id}`}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded flex-shrink-0">
        {Icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{folder.name}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
          <span>{folder._count.documents} documents</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(folder.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

