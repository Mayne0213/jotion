"use client";

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef } from 'react';
import { Upload, X, Loader2, Music, Play, Pause } from 'lucide-react';

interface AudioComponentProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
}

export const AudioComponent = ({ node, updateAttributes, deleteNode }: AudioComponentProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Audio file size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'audio');

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload audio');
      }

      const data = await response.json();
      updateAttributes({
        src: data.url,
        fileName: file.name,
        fileSize: file.size,
        loading: false,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload audio');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInput = () => {
    const url = window.prompt('Enter audio URL:');
    if (url) {
      const fileName = url.split('/').pop() || 'audio.mp3';
      updateAttributes({
        src: url,
        fileName,
        loading: false,
      });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // If audio is already loaded
  if (node.attrs.src && !node.attrs.loading) {
    return (
      <NodeViewWrapper className="audio-wrapper">
        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 max-w-md">
          <button
            onClick={deleteNode}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            title="Delete audio"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Music className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {node.attrs.fileName || 'Audio File'}
                </p>
              </div>
              {node.attrs.fileSize && (
                <p className="text-xs text-gray-500">
                  {formatFileSize(node.attrs.fileSize)}
                </p>
              )}
            </div>
          </div>

          <audio
            ref={audioRef}
            src={node.attrs.src}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
            className="w-full mt-3"
          />
        </div>
      </NodeViewWrapper>
    );
  }

  // Upload placeholder
  return (
    <NodeViewWrapper className="audio-wrapper">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-md">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Uploading audio...</p>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <Music className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Upload Audio
                </button>
                <button
                  onClick={handleUrlInput}
                  className="block w-full px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Or enter URL
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Supports: MP3, WAV, OGG, MP4, WebM (Max 50MB)
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

