import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Loader2, AlertCircle, Link } from 'lucide-react';
import { isValidUrl, BookmarkMetadata } from '@/shared/lib/metadata-extractor';
import type { BookmarkModalProps } from '@/shared/types';

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  onAddBookmark,
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<BookmarkMetadata | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setPreview(null);

    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const metadata = await response.json();
      setPreview(metadata);
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setError('Failed to fetch bookmark data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBookmark = () => {
    if (preview) {
      onAddBookmark(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    setPreview(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Add Bookmark
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching bookmark data...
            </div>
          )}

          {preview && !isLoading && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start gap-3">
                {preview.image && (
                  <img
                    src={preview.image}
                    alt={preview.title || 'Preview'}
                    className="w-16 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {preview.title || 'No title'}
                  </h4>
                  {preview.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                      {preview.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {preview.domain}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Fetch Preview'
              )}
            </Button>
            {preview && (
              <Button
                type="button"
                onClick={handleAddBookmark}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Bookmark
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

