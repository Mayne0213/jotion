import { DocumentWithRelations } from '../model/types';
import { cn } from '@/shared/lib/utils';
import { FileText, Calendar, Folder } from 'lucide-react';
import Link from 'next/link';

interface DocumentItemProps {
  document: DocumentWithRelations;
  className?: string;
}

export const DocumentItem = ({ document, className }: DocumentItemProps) => {
  const Icon = document.icon ? 
    <span className="text-2xl">{document.icon}</span> : 
    <FileText className="w-6 h-6 text-gray-400" />;

  return (
    <Link 
      href={`/documents/${document.id}`}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded flex-shrink-0">
        {Icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{document.title}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
          {document.folder && (
            <div className="flex items-center gap-1">
              <Folder className="w-3 h-3" />
              <span className="truncate">{document.folder.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(document.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

