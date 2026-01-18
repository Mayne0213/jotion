"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DocumentSidebar } from '@/widgets/editor/sidebar/document-sidebar';
import { RichTextEditor } from '@/widgets/editor/editor/core/rich-text-editor';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Copy, Check, Share2, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Document } from '@/entities/document';
import { SharedDocumentSkeleton } from '@/shared/ui/skeleton';

interface SharedDocument extends Document {
  user: {
    name: string;
    email: string;
  };
}

export default function ShareDocumentPage() {
  const params = useParams();
  const documentId = params.id as string;
  
  const [document, setDocument] = useState<SharedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/public`);
        if (!response.ok) {
          throw new Error('Document not found or not published');
        }
        
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  const getWordCount = (content: any): number => {
    if (!content) return 0;
    
    const extractText = (node: any): string => {
      if (typeof node === 'string') return node;
      if (node.text) return node.text;
      if (node.content) {
        return node.content.map(extractText).join(' ');
      }
      return '';
    };
    
    const text = extractText(content);
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return <SharedDocumentSkeleton />;
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 dark:text-red-400 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Document Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'This document may not exist or may not be publicly shared.'}
          </p>
          <Link href="/">
            <Button className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = getWordCount(document.content);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F1F1F]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Document Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <RichTextEditor
                  content={document.content}
                  editable={false}
                  readOnly={true}
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <DocumentSidebar
                content={document.content}
                title={document.title}
                lastSaved={new Date(document.updatedAt)}
                wordCount={wordCount}
                documentId={document.id}
              />
              
              {/* Document Info */}
              <div className="mt-6 bg-white dark:bg-secondary rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Document Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Author: {document.user.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Updated: {new Date(document.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>This document was shared from Jotion</p>
            <p className="mt-1">
              Last updated: {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
