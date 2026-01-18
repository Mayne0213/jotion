"use client";

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { buildFileTree, FileNode } from '@/shared/lib/file-tree-utils';
import { FileIcon } from '@/shared/ui/file-icons';

interface FileTreeProps {
  files: FileNode[];
  onFileSelect?: (file: FileNode) => void;
  selectedFileId?: string;
  className?: string;
}

const TreeNode: React.FC<{
  node: FileNode;
  level: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onFileSelect: (file: FileNode) => void;
  selectedFileId?: string;
}> = ({ node, level, expanded, onToggle, onFileSelect, selectedFileId }) => {
  const isExpanded = expanded.has(node.id);
  const isSelected = selectedFileId === node.id;

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggle(node.id);
    } else {
      console.log('FileTree: File clicked:', {
        id: node.id,
        name: node.name,
        path: node.path,
        type: node.type
      });
      onFileSelect(node);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-100",
          isSelected && "bg-blue-100 text-blue-900",
          "select-none"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-600" />
            ) : (
              <Folder className="h-4 w-4 text-blue-600" />
            )}
          </>
        ) : (
          <>
            <div className="w-3" />
            <FileIcon fileName={node.name} language={node.language} />
          </>
        )}
        <span className="text-sm truncate flex-1">{node.name}</span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  onFileSelect,
  selectedFileId,
  className,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [tree, setTree] = useState<FileNode[]>([]);

  useEffect(() => {
    const builtTree = buildFileTree(files);
    setTree(builtTree);
    
    // Auto-expand root folders
    const rootFolders = builtTree.filter(node => node.type === 'folder');
    setExpanded(new Set(rootFolders.map(folder => folder.id)));
  }, [files]);

  const handleToggle = (id: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (tree.length === 0) {
    return (
      <div className={cn("p-4 text-center text-gray-500", className)}>
        <File className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No files available</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-y-auto", className)}>
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          onToggle={handleToggle}
          onFileSelect={onFileSelect || (() => {})}
          selectedFileId={selectedFileId}
        />
      ))}
    </div>
  );
};
