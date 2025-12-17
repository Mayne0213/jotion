"use client";

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef } from 'react';
import { Upload, X, Loader2, File, Download, FileText, FileSpreadsheet } from 'lucide-react';

interface FileComponentProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
}

export const FileComponent = ({ node, updateAttributes, deleteNode }: FileComponentProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'documents');

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const data = await response.json();
      updateAttributes({
        src: data.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        loading: false,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInput = () => {
    const url = window.prompt('Enter file URL:');
    if (url) {
      const fileName = url.split('/').pop() || 'file';
      updateAttributes({
        src: url,
        fileName,
        loading: false,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return <File className="w-6 h-6 text-red-500" />;
    if (fileType?.includes('word') || fileType?.includes('document')) return <FileText className="w-6 h-6 text-blue-500" />;
    if (fileType?.includes('excel') || fileType?.includes('sheet')) return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    if (fileType?.includes('text')) return <FileText className="w-6 h-6 text-gray-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const handleDownload = () => {
    if (node.attrs.src) {
      window.open(node.attrs.src, '_blank');
    }
  };

  // If file is already loaded
  if (node.attrs.src && !node.attrs.loading) {
    return (
      <NodeViewWrapper className="file-wrapper">
        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 max-w-md hover:bg-gray-100 transition-colors">
          <button
            onClick={deleteNode}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
            title="Delete file"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4 pr-8">
            <div className="flex-shrink-0">
              {getFileIcon(node.attrs.fileType)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {node.attrs.fileName || 'File'}
              </p>
              {node.attrs.fileSize && (
                <p className="text-xs text-gray-500">
                  {formatFileSize(node.attrs.fileSize)}
                </p>
              )}
            </div>

            <button
              onClick={handleDownload}
              className="flex-shrink-0 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Download file"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  // Upload placeholder
  return (
    <NodeViewWrapper className="file-wrapper">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-md">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Uploading file...</p>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <File className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Upload File
                </button>
                <button
                  onClick={handleUrlInput}
                  className="block w-full px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Or enter URL
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Supports: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV (Max 20MB)
              </p>
            </div>
            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

