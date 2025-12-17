"use client";

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import SignedImage from '@/shared/ui/SignedImage';

interface ImageUploadComponentProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
}

export const ImageUploadComponent = ({ node, updateAttributes, deleteNode }: ImageUploadComponentProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'images');

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      updateAttributes({
        src: data.url,
        alt: file.name,
        title: file.name,
        loading: false,
        width: null, // Let browser determine initial width
        path: data.path, // Store file path for deletion
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInput = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      updateAttributes({
        src: url,
        loading: false,
        width: null,
      });
    }
  };

  const handleDelete = async () => {
    console.log('Deleting image, path:', node.attrs.path);
    
    // If this is an uploaded file (has path), delete it from storage
    if (node.attrs.path) {
      try {
        const response = await fetch(`/api/upload?path=${encodeURIComponent(node.attrs.path)}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to delete file from storage:', errorData);
        } else {
          console.log('Successfully deleted file from storage');
        }
      } catch (error) {
        console.error('Error deleting file from storage:', error);
        // Continue with node deletion even if file deletion fails
      }
    } else {
      console.log('No path attribute found, skipping storage deletion');
    }
    
    deleteNode();
  };

  // Store event handlers in refs to ensure cleanup
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseUpHandlerRef = useRef<(() => void) | null>(null);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      // Cleanup any remaining event listeners
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }
      if (mouseUpHandlerRef.current) {
        document.removeEventListener('mouseup', mouseUpHandlerRef.current);
      }
    };
  }, []);

  // Handle corner resize (maintains aspect ratio)
  const handleCornerMouseDown = useCallback((e: React.MouseEvent, corner: 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clean up any existing handlers first
    if (mouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
    }
    if (mouseUpHandlerRef.current) {
      document.removeEventListener('mouseup', mouseUpHandlerRef.current);
    }

    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = imageRef.current?.offsetWidth || 0;
    const startHeight = imageRef.current?.offsetHeight || 0;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (e: MouseEvent) => {
      let deltaX = 0;
      
      // Calculate delta based on corner
      if (corner === 'se' || corner === 'ne') {
        deltaX = e.clientX - startX; // Right side
      } else {
        deltaX = startX - e.clientX; // Left side
      }
      
      const newWidth = Math.max(200, Math.min(startWidth + deltaX, 1200));
      
      if (imageRef.current && containerRef.current) {
        imageRef.current.style.width = `${newWidth}px`;
        imageRef.current.style.height = 'auto'; // Maintain aspect ratio
        containerRef.current.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      const finalWidth = imageRef.current?.offsetWidth;
      if (finalWidth) {
        updateAttributes({
          width: finalWidth,
        });
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Clear refs
      mouseMoveHandlerRef.current = null;
      mouseUpHandlerRef.current = null;
    };

    // Store handlers in refs
    mouseMoveHandlerRef.current = handleMouseMove;
    mouseUpHandlerRef.current = handleMouseUp;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes]);

  // If image is already loaded
  if (node.attrs.src && !node.attrs.loading) {
    const imageWidth = node.attrs.width;
    
    return (
      <NodeViewWrapper className="image-upload-wrapper">
        <div 
          ref={containerRef}
          className="relative group inline-block max-w-full"
          style={{ 
            width: imageWidth ? `${imageWidth}px` : 'auto',
            maxWidth: '100%'
          }}
        >
          {node.attrs.path ? (
            <SignedImage
              fileKey={node.attrs.path}
              alt={node.attrs.alt || ''}
              className="rounded-lg w-full h-auto block select-none"
              style={{ 
                width: imageWidth ? `${imageWidth}px` : 'auto',
                maxWidth: '100%'
              }}
            />
          ) : (
            <img
              ref={imageRef}
              src={node.attrs.src}
              alt={node.attrs.alt || ''}
              title={node.attrs.title || ''}
              className="rounded-lg w-full h-auto block select-none"
              style={{ 
                width: imageWidth ? `${imageWidth}px` : 'auto',
                maxWidth: '100%'
              }}
              draggable={false}
            />
          )}
          
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg hover:bg-red-600"
            title="Delete image"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Corner resize handles - 4 corners */}
          {/* Top-left corner */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md hover:scale-125"
            onMouseDown={(e) => handleCornerMouseDown(e, 'nw')}
            title="Resize"
          />

          {/* Top-right corner */}
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md hover:scale-125"
            onMouseDown={(e) => handleCornerMouseDown(e, 'ne')}
            title="Resize"
          />

          {/* Bottom-left corner */}
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md hover:scale-125"
            onMouseDown={(e) => handleCornerMouseDown(e, 'sw')}
            title="Resize"
          />

          {/* Bottom-right corner */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md hover:scale-125"
            onMouseDown={(e) => handleCornerMouseDown(e, 'se')}
            title="Resize"
          />

          {/* Resizing overlay */}
          {isResizing && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-20 rounded-lg pointer-events-none z-10"></div>
          )}

          {node.attrs.caption && (
            <div className="text-sm text-gray-500 text-center mt-2">
              {node.attrs.caption}
            </div>
          )}
        </div>
      </NodeViewWrapper>
    );
  }

  // Upload placeholder
  return (
    <NodeViewWrapper className="image-upload-wrapper">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Uploading image...</p>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Upload Image
                </button>
                <button
                  onClick={handleUrlInput}
                  className="block w-full px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Or enter URL
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, GIF, WebP, SVG (Max 10MB)
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

