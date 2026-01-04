"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  FileText,
  Code,
  Image,
  FileCode,
  FileImage,
  FileJson,
  FileType,
  FileArchive
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  language?: string;
  size?: number;
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  onFileSelect?: (file: FileNode) => void;
  selectedFileId?: string;
  className?: string;
}

const getFileIcon = (fileName: string, language?: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (language) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return <Code className="h-4 w-4 text-yellow-600" />;
      case 'python':
        return <FileCode className="h-4 w-4 text-blue-600" />;
      case 'java':
        return <FileCode className="h-4 w-4 text-orange-600" />;
      case 'html':
        return <FileCode className="h-4 w-4 text-red-600" />;
      case 'css':
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileCode className="h-4 w-4 text-gray-600" />;
    }
  }

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <Code className="h-4 w-4 text-yellow-600" />;
    case 'py':
      return <FileCode className="h-4 w-4 text-blue-600" />;
    case 'java':
      return <FileCode className="h-4 w-4 text-orange-600" />;
    case 'html':
    case 'htm':
      return <FileCode className="h-4 w-4 text-red-600" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCode className="h-4 w-4 text-blue-500" />;
    case 'json':
      return <FileJson className="h-4 w-4 text-yellow-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileImage className="h-4 w-4 text-green-600" />;
    case 'md':
    case 'txt':
      return <FileText className="h-4 w-4 text-gray-600" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileArchive className="h-4 w-4 text-purple-600" />;
    default:
      return <File className="h-4 w-4 text-gray-600" />;
  }
};

const buildFileTree = (files: FileNode[]): FileNode[] => {
  const tree: FileNode[] = [];
  const pathMap = new Map<string, FileNode>();

  // Sort files by path
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sortedFiles) {
    const pathParts = file.path.split('/');
    let currentPath = '';
    let parentNode: FileNode | undefined;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (i === pathParts.length - 1) {
        // This is the file itself - preserve the original ID
        // Don't override file.id with currentPath
        if (parentNode) {
          if (!parentNode.children) parentNode.children = [];
          parentNode.children.push(file);
        } else {
          tree.push(file);
        }
        pathMap.set(currentPath, file);
      } else {
        // This is a folder
        let folderNode = pathMap.get(currentPath);
        if (!folderNode) {
          folderNode = {
            id: currentPath,
            name: part,
            path: currentPath,
            type: 'folder',
            children: [],
          };
          if (parentNode) {
            if (!parentNode.children) parentNode.children = [];
            parentNode.children.push(folderNode);
          } else {
            tree.push(folderNode);
          }
          pathMap.set(currentPath, folderNode);
        }
        parentNode = folderNode;
      }
    }
  }

  return tree;
};

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
            {getFileIcon(node.name, node.language)}
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
